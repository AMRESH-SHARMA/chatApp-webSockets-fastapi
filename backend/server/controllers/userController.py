from ..database import (userCollection)
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from google.oauth2 import id_token
from google.auth.transport import requests
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


async def c_GoogleLogin(payload: dict, Authorize: dict):
    try:
        user = id_token.verify_oauth2_token(payload.token, requests.Request(
        ), "914599604729-2b4cnghp7bqijv6lb35eqj4pg8lu46s0.apps.googleusercontent.com")
        if 1:
        # if res:
          # Token generate
            access_token = Authorize.create_access_token(subject=user['email'])
            # update_jwt = await userCollection.update_one({"email": user['email']}, {"$set": {"token": payload.token}})
            # if update_jwt:
            if 1:
                msgresp = user['name'] + ' Authorized Successfully'
                return JSONResponse(content={'SUCCESS': True, 'MSG': msgresp, 'DATA': access_token})
        return JSONResponse(status_code=401, content={'SUCCESS': False, 'MSG': 'retry again'})
    except ValueError:
        return JSONResponse(status_code=401, content={'SUCCESS': False, 'MSG': 'unauthorized'})
