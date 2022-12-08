from fastapi import APIRouter, Body
from fastapi import APIRouter, Depends
from fastapi_jwt_auth import AuthJWT
from ..models.userModel import (
    UserSchema,
)
from ..controllers.userController import (
    c_RegisterUser,
    c_LoginUser,
)


router = APIRouter()


# Register


@router.post("/r")
async def registerUser(user: UserSchema = Body(...)):
    res = await c_RegisterUser(user)
    if res:
        return res


# Login


@router.post('/l')
async def login(user: UserSchema = Body(...), Authorize: AuthJWT = Depends()):
    res = await c_LoginUser(user, Authorize)
    if res:
        return res

