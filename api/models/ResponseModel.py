from typing import List, Optional
from pydantic import BaseModel

class Article(BaseModel):
    title: str
    image_url: str
    article_url: str
    summary: str
    ticker: str
    publication_datetime: str
    sentiment: str
    market_date: str
    open_price: Optional[float]
    close_price: Optional[float]

class ResponseModel(BaseModel):
    message: str
    articles: List[Article]
    code: int
