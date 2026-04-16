import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    // Important: we use the service role key to query api_keys globally bypassing RLS constraints
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extract Bearer token from header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing or invalid API key' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const apiKey = authHeader.replace('Bearer ', '')

    // Validate the API key against the database
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, user_id, is_active')
      .eq('key', apiKey)
      .single()

    if (keyError || !keyData || !keyData.is_active) {
      return new Response(JSON.stringify({ error: 'Invalid or inactive API key' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Parse the incoming usage event
    const payload = await req.json()
    const { provider, model, tokens, cost, latency } = payload

    if (!provider || !model) {
      return new Response(JSON.stringify({ error: 'Missing required payload fields: provider, model' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Convert cost to cents string or integer depending on your DB
    const costInCents = typeof cost === 'number' ? Math.round(cost * 100) : 0

    // Insert the tracking log
    const { error: insertError } = await supabase
      .from('usage_logs')
      .insert({
        user_id: keyData.user_id,
        api_key_id: keyData.id,
        provider,
        model,
        prompt_tokens: Math.floor((tokens || 0) * 0.4),
        completion_tokens: Math.ceil((tokens || 0) * 0.6),
        total_tokens: tokens || 0,
        cost_in_cents: costInCents,
        latency_ms: latency || 0,
      })

    if (insertError) {
      console.error('Usage log insert error:', insertError)
      return new Response(JSON.stringify({ error: 'Failed to record usage event' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Update the last used timestamp on the API key async (don't block the request response)
    supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key', apiKey)
      .then((res) => {
        if(res.error) console.error("Failed to update last_used_at", res.error);
      });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
