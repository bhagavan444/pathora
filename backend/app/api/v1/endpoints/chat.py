from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import StreamingResponse
import asyncio
from typing import Dict
from app.services.orchestrator.intelligent_router import IntelligentRouter
from datetime import datetime
import uuid

router = APIRouter()
router_engine = IntelligentRouter()

# In-memory storage for frontend integration compatibility
chat_sessions = {}

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

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]

    async def send_personal_message(self, message: str, session_id: str):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_text(message)

manager = ConnectionManager()

import json

@router.post("/stream/{session_id}")
async def sse_chat(session_id: str, query: dict):
    """
    Server-Sent Events (SSE) endpoint for ultra-fast ChatGPT-like typing responses.
    """
    user_message = query.get("message", "")
    
    chat_sessions.setdefault(session_id, []).append({
        "role": "user",
        "message": user_message,
        "time": datetime.now().isoformat()
    })
    
    async def sse_generator():
        full_reply = ""
        try:
            async for token in router_engine.stream_rag_response(user_message, session_id):
                full_reply += token
                yield f"data: {json.dumps({'message': token})}\n\n"
                
            chat_sessions.setdefault(session_id, []).append({
                "role": "assistant",
                "message": full_reply,
                "time": datetime.now().isoformat()
            })
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'message': f'\\n\\n⚠️ Error: {str(e)}'})}\n\n"
            yield "data: [DONE]\n\n"
        
    return StreamingResponse(sse_generator(), media_type="text/event-stream")

@router.websocket("/ws/{session_id}")
async def websocket_chat(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            # Receive text or binary from the client
            data = await websocket.receive_text()
            
            # Send immediate feedback
            await websocket.send_json({"type": "status", "content": "thinking..."})
            
            async for token in router_engine.stream_rag_response(data, session_id):
                await websocket.send_json({"type": "chunk", "content": token})
                
            await websocket.send_json({"type": "done"})
            
    except WebSocketDisconnect:
        manager.disconnect(session_id)
    except Exception as e:
        await websocket.send_json({"type": "error", "content": str(e)})
        manager.disconnect(session_id)
