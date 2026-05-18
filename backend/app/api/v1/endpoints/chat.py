from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
import asyncio
from typing import Dict
from app.services.orchestrator.intelligent_router import IntelligentRouter
from datetime import datetime
import uuid
import json
import logging

logger = logging.getLogger("chat_endpoint")

router = APIRouter()
router_engine = IntelligentRouter()

# In-memory storage for frontend integration compatibility
chat_sessions = {}


# ─── CRUD Operations ────────────────────────────────────────────────────────────

@router.get("/chats")
async def get_chats():
    sessions = []
    for cid, msgs in chat_sessions.items():
        title = msgs[0]['message'][:30] if msgs else "New Chat"
        sessions.append({
            "_id": cid,
            "title": title,
            "messages": msgs,
            "createdAt": msgs[0].get("time") if msgs else datetime.now().isoformat()
        })
    return {"sessions": sessions}


@router.post("/chats")
async def create_chat():
    chat_id = str(uuid.uuid4())
    chat_sessions[chat_id] = []
    return {"chat_id": chat_id}


@router.get("/chats/{chat_id}")
async def get_chat(chat_id: str):
    if chat_id in chat_sessions:
        return {"messages": chat_sessions[chat_id]}
    return {"error": "Not found"}


@router.delete("/chats/{chat_id}")
async def delete_chat(chat_id: str):
    if chat_id in chat_sessions:
        del chat_sessions[chat_id]
        return {"success": True}
    return {"error": "Not found"}


@router.delete("/chats")
async def delete_all_chats():
    chat_sessions.clear()
    return {"success": True}


# ─── SSE Streaming Chat Endpoint ───────────────────────────────────────────────

@router.post("/stream/{session_id}")
async def sse_chat(session_id: str, query: dict):
    """
    Server-Sent Events (SSE) endpoint for streaming AI responses.
    Returns JSON chunks with a 'text' key for each token, followed by [DONE].
    """
    user_message = (query.get("message") or "").strip()

    if not user_message:
        return {"error": "Message cannot be empty"}

    # Store user message
    chat_sessions.setdefault(session_id, []).append({
        "role": "user",
        "message": user_message,
        "time": datetime.now().isoformat()
    })

    async def sse_generator():
        full_reply = ""
        try:
            async for token in router_engine.stream_rag_response(user_message, session_id):
                if token:
                    full_reply += token
                    # Use 'text' key — matches what the frontend parses
                    payload = json.dumps({"text": token})
                    yield f"data: {payload}\n\n"

            # Save assistant response
            if full_reply.strip():
                chat_sessions.setdefault(session_id, []).append({
                    "role": "assistant",
                    "message": full_reply,
                    "time": datetime.now().isoformat()
                })

            yield "data: [DONE]\n\n"

        except Exception as e:
            logger.error(f"SSE stream error for session {session_id}: {e}", exc_info=True)
            error_text = "\n\n⚠️ An error occurred while generating the response."
            full_reply += error_text
            yield f"data: {json.dumps({'text': error_text})}\n\n"

            # Save partial response
            if full_reply.strip():
                chat_sessions.setdefault(session_id, []).append({
                    "role": "assistant",
                    "message": full_reply,
                    "time": datetime.now().isoformat()
                })

            yield "data: [DONE]\n\n"

    return StreamingResponse(
        sse_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering on Render
        }
    )


# ─── Non-Streaming Chat Endpoint ──────────────────────────────────────────────

@router.post("/message/{session_id}")
async def non_streaming_chat(session_id: str, query: dict):
    """
    Non-streaming fallback endpoint.
    Returns { "reply": "...", "chat_id": "..." }
    """
    user_message = (query.get("message") or "").strip()

    if not user_message:
        return {"reply": "Message cannot be empty", "chat_id": session_id}

    chat_sessions.setdefault(session_id, []).append({
        "role": "user",
        "message": user_message,
        "time": datetime.now().isoformat()
    })

    full_reply = ""
    try:
        async for token in router_engine.stream_rag_response(user_message, session_id):
            if token:
                full_reply += token
    except Exception as e:
        logger.error(f"Non-streaming chat error: {e}", exc_info=True)
        full_reply = "I encountered an issue generating a response. Please try again."

    if not full_reply.strip():
        full_reply = "I couldn't generate a response. Please try again."

    chat_sessions.setdefault(session_id, []).append({
        "role": "assistant",
        "message": full_reply,
        "time": datetime.now().isoformat()
    })

    return {"reply": full_reply, "chat_id": session_id}


# ─── WebSocket Chat (Optional) ────────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

manager = ConnectionManager()


@router.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"type": "status", "content": "thinking..."})

            async for token in router_engine.stream_rag_response(data, session_id):
                await websocket.send_json({"type": "chunk", "content": token})

            await websocket.send_json({"type": "done"})

    except WebSocketDisconnect:
        manager.disconnect(session_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "content": "An error occurred."})
        except Exception:
            pass
        manager.disconnect(session_id)
