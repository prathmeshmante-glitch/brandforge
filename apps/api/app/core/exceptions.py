from fastapi import HTTPException, status


class UnauthorizedException(HTTPException):
    def __init__(self, detail: str = "Authentication token missing or invalid"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


class ForbiddenException(HTTPException):
    def __init__(self, detail: str = "Access forbidden to target resource"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class NotFoundException(HTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


class UnprocessableException(HTTPException):
    def __init__(self, detail: str = "Unprocessable payload"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)
