from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from fastapi.responses import StreamingResponse
import asyncio
from typing import Dict
from app.services.orchestrator.intelligent_router import IntelligentRouter

router = APIRouter()
router_engine = IntelligentRouter()

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

@router.post("/stream/{session_id}")
async def sse_chat(session_id: str, query: dict):
    """
    Server-Sent Events (SSE) endpoint for ultra-fast ChatGPT-like typing responses.
    """
    user_message = query.get("message", "")
    
    async def sse_generator():
        async for token in router_engine.stream_rag_response(user_message, session_id):
            yield f"data: {token}\n\n"
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
