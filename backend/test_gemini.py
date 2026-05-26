import os
from dotenv import load_dotenv
from google import genai

def test_gemini():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    
    print("GEMINI KEY LOADED:", bool(api_key))
    if not api_key or api_key == "your_gemini_api_key_here":
        print("FAILURE: Invalid or missing API key in .env")
        return

    try:
        # SDK Initialization
        client = genai.Client(api_key=api_key)
        print("SDK Initialized successfully.")

        # Minimal Prompt
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents="Say 'Hello, API is working!'"
        )

        if response and response.text:
            print("SUCCESS: API call returned valid response.")
            print("Response:", response.text.strip())
        else:
            print("FAILURE: Empty response returned from API.")

    except Exception as e:
        print("FAILURE: Gemini API Call Error.")
        print(f"Exception: {str(e)}")

if __name__ == "__main__":
    test_gemini()
