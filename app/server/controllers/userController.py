from ..database import (userCollection)
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
# helpers


def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "password": user["password"],
        "token": user["token"],
    }


# Registration


async def c_RegisterUser(payload: dict) -> dict:
    emailExist = await userCollection.find_one({"email": payload.email})
    if emailExist:
        return JSONResponse(status_code=404, content={'SUCCESS': False, 'MSG': 'Email Already Exist'})
    user = await userCollection.insert_one(jsonable_encoder(payload))
    res = await userCollection.find_one({"_id": user.inserted_id})
    return JSONResponse(content={'SUCCESS': True, 'MSG': 'Register Success', 'DATA': user_helper(res)})

# Login


async def c_LoginUser(payload: dict, Authorize: dict) -> dict:
    res = await userCollection.find_one({"email": payload.email, "password": payload.password})
    if res:
      # Token generate
        access_token = Authorize.create_access_token(subject=payload.email)
        update_jwt = await userCollection.update_one({"email": payload.email}, {"$set": {"token": access_token}})
        if update_jwt:
            return JSONResponse(content={'SUCCESS': True, 'MSG': 'Login Success', 'DATA': access_token})

    return JSONResponse(status_code=401, content={'SUCCESS': False, 'MSG': 'Invalid Credentials'})

