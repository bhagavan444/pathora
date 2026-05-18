import asyncio
import logging
from google import genai
from app.core.config import settings

logger = logging.getLogger("ai_orchestrator")

# ─── Supported model (use latest stable model) ─────────────────────────────
MODEL_NAME = "gemini-2.5-flash"


class AIOrchestrator:
    def __init__(self):
        self.client = None
        if settings.GEMINI_API_KEY:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
                logger.info(f"Gemini client initialized successfully. Model: {MODEL_NAME}")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")
                self.client = None
        else:
            logger.warning("GEMINI_API_KEY not configured. AI responses will be unavailable.")

    async def stream_response(self, prompt: str, session_id: str):
        """
        Stream AI-generated tokens from Google Gemini.
        Uses the async client (client.aio) with proper await + async iteration.
        """
        if not self.client:
            yield "AI service is not configured. Please set the GEMINI_API_KEY environment variable."
            return

        try:
            # The google-genai SDK requires `await` on the async stream call first,
            # then async-iterate over the returned stream object.
            response_stream = await self.client.aio.models.generate_content_stream(
                model=MODEL_NAME,
                contents=prompt,
            )

            has_content = False
            async for chunk in response_stream:
                if chunk.text:
                    has_content = True
                    yield chunk.text
                    await asyncio.sleep(0)  # Yield control to event loop

            if not has_content:
                yield "I couldn't generate a response for that. Please try rephrasing your question."

        except Exception as e:
            error_str = str(e)
            logger.error(f"Gemini API error for session {session_id}: {error_str}", exc_info=True)

            # Provide user-friendly messages based on error type
            if "429" in error_str or "ResourceExhausted" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                yield "I've reached the usage limit temporarily. Please wait a minute and try again."
            elif "403" in error_str or "PERMISSION_DENIED" in error_str:
                yield "The AI service encountered an authentication issue. Please verify the API key configuration."
            elif "404" in error_str or "NOT_FOUND" in error_str:
                yield f"The AI model '{MODEL_NAME}' is not available. Please contact support."
            elif "INVALID_ARGUMENT" in error_str:
                yield "The request was malformed. Please try rephrasing your message."
            elif "UNAVAILABLE" in error_str or "ServiceUnavailable" in error_str:
                yield "The AI service is temporarily unavailable. Please try again in a moment."
            elif "DeadlineExceeded" in error_str or "DEADLINE_EXCEEDED" in error_str:
                yield "The request timed out. Please try a shorter or simpler question."
            else:
                yield "I encountered an issue generating a response. Please try again."
