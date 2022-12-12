from fastapi import FastAPI
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Request
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
from pydantic import BaseModel
import socketio

from .routes.userRoute import router as UserRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[])
app = socketio.ASGIApp(sio, app)

allUsers = []


@sio.event
async def connect(sid, data, environ):
    allUsers.append(sid)
    print(sid, 'connected from react')


@sio.event
async def constatus(sid, data):
    print(sid, data)
    for user_sid in allUsers:
      if user_sid !=sid:
        await sio.emit('chatfrmServer', data + '# get connected', room=user_sid)


@sio.event
async def disconstatus(sid, data):
    print(sid, data)
    await sio.emit('chatfrmServer', data + '# get disconnected')


# CHATS
@sio.event
async def chats(sid, data):
    print(sid, data)
    await sio.emit('chatfrmServer', data)

# @sio.event
# async def ping(sid,data):
#     print(sid,data)
#     await sio.emit('pong','PONG!! RESPONSE FROM SERVER')


@sio.event
async def disconnect(sid):
    allUsers.remove(sid)
    print(sid, 'disconnected from react')
