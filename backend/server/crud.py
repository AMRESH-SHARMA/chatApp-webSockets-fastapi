
from sqlalchemy.orm import Session

from . import models, schemas

def get_user_by_email(db: Session, email: str):
    return db.query(models.UserInfo).filter(models.UserInfo.email == email).first()

def get_user_by_phone(db: Session, phone: str):
    return db.query(models.UserInfo).filter(models.UserInfo.phone == phone).first()


def create_user(db: Session, user: schemas.UserInfoBase):
    db_user = models.UserInfo(username=user.username, email=user.email, phone=user.phone)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user