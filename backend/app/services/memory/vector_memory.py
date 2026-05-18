from typing import List, Dict, Any
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from app.core.config import settings
import uuid
import logging

logger = logging.getLogger("vector_memory")

class VectorMemoryEngine:
    def __init__(self):
        self.collection_name = "conversational_memory"
        # In a real scenario, this client would be a singleton initialized at app startup.
        if settings.QDRANT_URL:
            self.client = AsyncQdrantClient(url=settings.QDRANT_URL)
            logger.info("Qdrant client initialized successfully.")
        else:
            self.client = None
            logger.info("QDRANT_URL not found. Qdrant initialization skipped.")
        
    async def ensure_collection(self):
        if not self.client:
            return
        try:
            collections = await self.client.get_collections()
            if not any(c.name == self.collection_name for c in collections.collections):
                await self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
                )
                logger.info(f"Created Qdrant collection '{self.collection_name}'")
        except Exception as e:
            logger.error(f"Error ensuring Qdrant collection: {e}")

    async def add_memory(self, session_id: str, text: str, embedding: List[float], metadata: Dict[str, Any] = None):
        """
        Store a conversation turn as an embedded memory.
        """
        if not self.client:
            return

        if metadata is None:
            metadata = {}
        metadata["session_id"] = session_id
        metadata["text"] = text
        
        point_id = str(uuid.uuid4())
        
        await self.client.upsert(
            collection_name=self.collection_name,
            points=[
                PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload=metadata
                )
            ]
        )

    async def search_memory(self, session_id: str, query_embedding: List[float], top_k: int = 5):
        """
        Retrieve semantically relevant past conversation turns using Vector Search.
        """
        if not self.client:
            return []

        # Note: Need to filter by session_id in production using Qdrant Filter models.
        results = await self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=top_k,
            # query_filter=Filter(must=[FieldCondition(key="session_id", match=MatchValue(value=session_id))])
        )
        return [res.payload["text"] for res in results]
