from typing import List
from pydantic import BaseModel, EmailStr, Field


class UserInfoBase(BaseModel):
    username: str = Field(...)
    email: EmailStr = Field(...)
    phone: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "username": "amresh",
                "email": "jdoe@x.edu.ng",
                "phone": "123456789"
            }
        }


class UserCreate(UserInfoBase):
    pass


class UserInfo(UserInfoBase):
    id: int

    class Config:
        orm_mode = True
