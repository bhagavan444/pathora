import logging
import time
import os
from extensions import db
from models import SemanticEmbedding

logger = logging.getLogger(__name__)

class SemanticEngine:
    def __init__(self):
        self.model = None
        self.model_name = 'all-MiniLM-L6-v2'
        
    def _lazy_load_model(self):
        """Lazy load the sentence transformer to save memory until needed."""
        if self.model is None:
            try:
                logger.info(f"[SEMANTIC_ENGINE] Starting model load: {self.model_name}")
                start_time = time.perf_counter()
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer(self.model_name)
                logger.info(f"[SEMANTIC_ENGINE] Model load completed in {time.perf_counter() - start_time:.2f}s")
            except ImportError:
                logger.error("[SEMANTIC_ENGINE] sentence-transformers not installed. SemanticEngine disabled.")
                self.model = None
                raise RuntimeError("sentence-transformers module is missing")
            except Exception as e:
                logger.error(f"[SEMANTIC_ENGINE] Failed to load Semantic Model: {e}")
                self.model = None
                raise RuntimeError(f"Semantic model loading failed: {e}")

    def generate_embedding(self, text: str) -> list:
        """Generate a dense vector embedding for a given text."""
        self._lazy_load_model()
        if not self.model or not text.strip():
            return []
            
        try:
            embedding = self.model.encode(text)
            vector = embedding.tolist()
            if os.getenv("DEBUG_INTELLIGENCE_PIPELINE", "false").lower() == "true":
                logger.info(f"[DEBUG] [SEMANTIC_ENGINE] Generated vector dimension: {len(vector)}")
            return vector
        except Exception as e:
            import traceback
            logger.error(f"[SEMANTIC_ENGINE] Error generating embedding: {traceback.format_exc()}")
            raise RuntimeError(f"Embedding encoding failed: {str(e)}")

    def store_resume_embeddings(self, resume_id: str, resume_text: str):
        """
        Chunk the resume and store embeddings.
        Currently stores in standard JSONB array. Phase 3 will migrate to pgvector.
        """
        if not resume_text:
            return
            
        logger.info("[SEMANTIC_ENGINE] Starting chunking and embedding persistence...")
        start_time = time.perf_counter()
        
        # Basic chunking by paragraph for Phase 2
        chunks = [chunk.strip() for chunk in resume_text.split('\n\n') if len(chunk.strip()) > 30]
        
        # Add a full document chunk
        chunks.append(resume_text[:2000]) # truncated full text
        
        for idx, chunk in enumerate(chunks):
            chunk_type = "full_resume" if idx == len(chunks)-1 else f"chunk_{idx}"
            vector = self.generate_embedding(chunk)
            
            if vector:
                try:
                    embed_record = SemanticEmbedding(
                        resume_id=resume_id,
                        chunk_type=chunk_type,
                        chunk_text=chunk[:500], # store preview
                        embedding_vector=vector
                    )
                    db.session.add(embed_record)
                except Exception as e:
                    import traceback
                    logger.error(f"[SEMANTIC_ENGINE] Error preparing embedding record for {chunk_type}: {traceback.format_exc()}")
                    raise RuntimeError(f"Database insertion preparation failed: {str(e)}")
                    
        try:
            db.session.commit()
            logger.info(f"[SEMANTIC_ENGINE] Persistence completed in {time.perf_counter() - start_time:.2f}s")
        except Exception as e:
            import traceback
            db.session.rollback()
            logger.error(f"[DB_ROLLBACK] [SEMANTIC_ENGINE] Error saving embeddings to DB: {traceback.format_exc()}")
            raise RuntimeError(f"Database commit failed: {str(e)}")
