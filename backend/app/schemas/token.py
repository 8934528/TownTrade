from pydantic import BaseModel
from typing import Optional
from app.schemas.user import User

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: User

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = None

class RefreshToken(BaseModel):
    refresh_token: str
