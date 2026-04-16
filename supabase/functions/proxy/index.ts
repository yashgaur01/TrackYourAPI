import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-trackyourapi-key',
}

serve(async (req) => {
  // 1. Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    
    // Pattern: /proxy/[qt_key]/[provider]/[...remaining]
    if (pathParts.length < 3) {
      return new Response("Invalid Proxy URL pattern. Use /proxy/[qt_key]/[provider]/[path]", { status: 400 })
    }

    const qtKey = pathParts[1]
    const provider = pathParts[2]
    const providerIndex = pathParts.indexOf(provider)
    const remainingPath = pathParts.slice(providerIndex + 1).join('/')

    // 2. Validate TrackYourAPI Key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, user_id, is_active')
      .eq('key', qtKey)
      .single()

    if (keyError || !keyData || !keyData.is_active) {
      return new Response("Unauthorized: Invalid TrackYourAPI Key", { status: 401 })
    }

    // Update last_used_at (Non-blocking)
    supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', keyData.id).then(() => {})

    // 3. Resolve Target URL
    let targetBaseUrl = ""
    if (provider === 'openai') targetBaseUrl = "https://api.openai.com"
    else if (provider === 'anthropic') targetBaseUrl = "https://api.anthropic.com"
    else if (provider === 'google') targetBaseUrl = "https://generativelanguage.googleapis.com"
    else return new Response(`Unsupported provider: ${provider}`, { status: 400 })

    const targetUrl = `${targetBaseUrl}/${remainingPath}${url.search}`

    // 4. Prepare Forwarding
    const headers = new Headers(req.headers)
    headers.delete('host')
    headers.delete('x-trackyourapi-key')

    // Read body text once so we can pass it to fetch
    const bodyText = await req.text()

    const aiResponse = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: bodyText || undefined,
    })

    const contentType = aiResponse.headers.get('content-type')
    const isStream = contentType?.includes('text/event-stream')

    // 5. Build Proxy Response
    if (!isStream) {
      // For non-streaming, we can comfortably read the response and log it
      const resData = await aiResponse.arrayBuffer()
      const resText = new TextDecoder().decode(resData)

      // Background Logging
      // @ts-ignore
      EdgeRuntime.waitUntil((async () => {
        try {
          const json = JSON.parse(resText)
          await supabase.from('usage_logs').insert({
            user_id: keyData.user_id,
            api_key_id: keyData.id,
            provider,
            model: json.model || "proxy-auto",
            total_tokens: json.usage?.total_tokens || 0,
            prompt_tokens: json.usage?.prompt_tokens || 0,
            completion_tokens: json.usage?.completion_tokens || 0,
            tracking_source: 'proxy'
          }).catch(async () => {
            // Fallback if 'tracking_source' column doesn't exist yet
             await supabase.from('usage_logs').insert({
                user_id: keyData.user_id,
                api_key_id: keyData.id,
                provider,
                model: json.model || "proxy-auto",
                total_tokens: json.usage?.total_tokens || 0,
                prompt_tokens: json.usage?.prompt_tokens || 0,
                completion_tokens: json.usage?.completion_tokens || 0
             })
          })
        } catch (e) {
          console.error("Tracking error:", e)
        }
      })())

      return new Response(resData, {
        status: aiResponse.status,
        headers: { ...aiResponse.headers, ...corsHeaders }
      })
    }

    // 6. Streaming Pass-through
    return new Response(aiResponse.body, {
      status: aiResponse.status,
      headers: { ...aiResponse.headers, ...corsHeaders }
    })

  } catch (err) {
    console.error("Proxy Error:", err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders })
  }
})
