from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserSchema(BaseModel):
    email: EmailStr = Field(...)
    password: int = Field(...)
    token: Optional[str] = Field(None)

    class Config:
        schema_extra = {
            "example": {
                "email": "jdoe@x.edu.ng",
                "password": 123,
                "token": "xyzzz"
            }
        }


class Token(BaseModel):
    token: str