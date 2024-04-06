

from fastapi import FastAPI, Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.security.base import SecurityBase
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from typing import List 
from starlette.responses import Response
from jose import JWTError, jwt
from starlette.status import HTTP_401_UNAUTHORIZED

SECRET_KEY = "fyuufyaufiyaiyufoioyufdaaaaaa"  # Please change this to your own secret key
ALGORITHM = "HS256"  # This will be the algorithm used to sign & verify the JWT payload



class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        authorization: str = request.headers.get("Authorization")
        if not authorization:
            # No Authorization header, so we don't care about it, let the request pass
            # you may want to throw an error here.
            return await call_next(request)

        if not authorization.startswith("Bearer"):
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="Invalid JWT authentication header",
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = authorization.split(" ")[1]
        
        try:
            jwt.decode(
                token, 
                SECRET_KEY, 
                algorithms=[ALGORITHM]
            )
        except JWTError as e:
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            ) from e

        response: Response = await call_next(request)

        return response

