from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException
from . import models, schemas, crud
from .database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Dependency


def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@app.post("/user", response_model=schemas.UserInfo)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user_by_email = crud.get_user_by_email(db, email=user.email)
    db_user_by_phone = crud.get_user_by_phone(db, phone=user.phone)
    if db_user_by_email:
        raise HTTPException(
            status_code=400, detail="Email already registered")
    if db_user_by_phone:
        raise HTTPException(
            status_code=400, detail="Phone already registered")
    return crud.create_user(db=db, user=user)
