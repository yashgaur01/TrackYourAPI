import os
import sys

# Point to your local SDK project
sys.path.append("./sdk-python")

from openai import OpenAI
from trackyourapi import wrap_openai

print("Initializing TrackYourAPI Python Wrapper...")

# 1. Initialize the wrapper with your keys
try:
    client = wrap_openai(
        OpenAI(), # Standard OpenAI logic
        api_key="qt_85e5a381f431486199fc724afdcc2924",       # Your custom tracking key (generate from dashboard)
        

        endpoint="https://dbikmzkqpteicmcpfeew.supabase.co", # Your Supabase instance
        debug=True
    )
except Exception as e:
    print(f"Error initializing client: {e}")
    print("Make sure you have set the OPENAI_API_KEY environment variable!")
    sys.exit(1)

print("\nFiring LLM request to OpenAI...")

# 2. Make an OpenAI call normally - the SDK intercepts and tracks it automatically!
try:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Explain gravity in one short sentence."}]
    )

    print("\nResponse:", response.choices[0].message.content)
    
    # Give the background thread time to finish before the script exits
    import time
    print("\nWaiting for background tracking thread to finish...")
    time.sleep(2)
    
    print("\n✅ Success! The request was secretly logged in the background thread.")
    print("Go check your TrackYourAPI Web Dashboard to see the exact tokens, cost, and latency metrics!")
    
except Exception as e:
    print(f"\nFailed to get a response from OpenAI: {e}")
