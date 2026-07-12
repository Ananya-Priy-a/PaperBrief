from typing import Optional
from pydantic import BaseModel


class Query(BaseModel):
    question: str
    level: str = "undergraduate"
    mode: str = "normal"
    session_id: Optional[str] = None
