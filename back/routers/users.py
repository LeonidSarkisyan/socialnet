from fastapi import APIRouter, Depends
from passlib.context import CryptContext
import models
import schemas
from database import get_db
from sqlalchemy.orm import Session
from hashing import Hash
from oauth2 import get_current_user
from utils.users import get_profile

router = APIRouter(
    prefix='/users',
    tags=['users']
)


@router.post('/', response_model=schemas.UserAfterCreate)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(
        username=user.username,
        password=Hash.bcrypt(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    print(new_user.__dict__)
    return new_user


@router.get('/me')
def private(current_user: schemas.UserCreate = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_profile(current_user, db)

