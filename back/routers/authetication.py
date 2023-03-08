from fastapi import APIRouter, Depends, HTTPException
import models
import schemas
from database import get_db
from schemas import Login
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from hashing import Hash
from JWToken import create_access_token
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(
    tags=['authetication'],
    prefix='/authetication'
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post('/login')
def login(request: Login, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user:
        raise HTTPException(status_code=404, detail='User does not exist')
    if not Hash.verify(user.password, request.password):
        raise HTTPException(status_code=403, detail='Incorrect password')

    access_token = create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

