import asyncio
import logging
from typing import AsyncGenerator, List, Dict, Any
from app.services.ai.orchestrator import AIOrchestrator

logger = logging.getLogger("intelligent_router")


class IntelligentRouter:
    def __init__(self):
        self.ai_orchestrator = AIOrchestrator()
        # Vector memory is disabled by default — only enable if Qdrant is configured
        self.memory_engine = None
        try:
            from app.services.memory.vector_memory import VectorMemoryEngine
            engine = VectorMemoryEngine()
            if engine.client is not None:
                self.memory_engine = engine
                logger.info("Vector memory engine initialized.")
            else:
                logger.info("Vector memory skipped (no Qdrant configured).")
        except Exception as e:
            logger.warning(f"Vector memory initialization skipped: {e}")

    async def _build_prompt(self, query: str, context: str = "") -> str:
        """Build a clean, focused prompt for the AI model."""
        base = (
            "You are Pathora AI — a knowledgeable career guidance assistant.\n"
            "Provide clear, helpful, and well-structured answers.\n"
            "Use markdown formatting (headers, bold, lists, code blocks) when appropriate.\n"
            "Be concise but thorough."
        )
        if context and context.strip():
            return f"{base}\n\nRelevant context:\n{context}\n\nUser: {query}"
        return f"{base}\n\nUser: {query}"

    async def stream_rag_response(self, query: str, session_id: str) -> AsyncGenerator[str, None]:
        """
        Retrieval-Augmented Generation pipeline:
        1. Retrieve memory context (if available)
        2. Build optimized prompt
        3. Stream response from AI
        """
        logger.info(f"Processing query for session {session_id}")

        # Retrieve memory context (gracefully skip if unavailable)
        memory_context = ""
        if self.memory_engine:
            try:
                # Use zero vector as placeholder (real embedding would come from an embedding model)
                query_embedding = [0.0] * 768
                memory_results = await self.memory_engine.search_memory(session_id, query_embedding)
                memory_context = "\n".join(memory_results) if memory_results else ""
            except Exception as e:
                logger.warning(f"Memory retrieval skipped: {e}")

        # Build prompt
        final_prompt = await self._build_prompt(query, memory_context)

        # Stream response
        has_yielded = False
        try:
            async for chunk in self.ai_orchestrator.stream_response(final_prompt, session_id):
                if chunk:
                    has_yielded = True
                    yield chunk

            if not has_yielded:
                yield "I couldn't generate a response. Please try again."

        except Exception as e:
            logger.error(f"Stream execution error: {e}", exc_info=True)
            yield "I encountered an issue processing your request. Please try again."
