from fastapi import FastAPI
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, WebSocket, Request, Request
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel

from .routes.userRoute import router as UserRouter

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class Settings(BaseModel):
    authjwt_secret_key: str = "secret"
    # authjwt_access_token_expires: int = 1


@AuthJWT.load_config
def get_config():
    return Settings()


@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": 'settings'}


app.include_router(UserRouter, prefix="/api")


class SocketManager:
    def __init__(self):
        self.active_connections: List[(WebSocket, str)] = []

    async def connect(self, websocket: WebSocket, user: str):
        await websocket.accept()
        self.active_connections.append((websocket, user))

    def disconnect(self, websocket: WebSocket, user: str):
        self.active_connections.remove((websocket, user))

    async def broadcast(self, data: dict):
        for connection in self.active_connections:
            await connection[0].send_text(data)


manager = SocketManager()

senders=[]
@app.websocket("/ws/{client_name}")
async def chat(websocket: WebSocket, client_name: str):
    sender = client_name
    await manager.connect(websocket, sender)
    # await manager.broadcast(F"{sender} got connected ")   
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Client# {sender} Says: {data}")
            print(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, sender)
        await manager.broadcast(f"Client #{sender} left the chat")
