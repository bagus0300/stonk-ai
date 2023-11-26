from tortoise.models import Model
from tortoise.fields import (
    IntField, CharField, TextField, ForeignKeyField, CharEnumField
)
from enum import Enum

class SentimentEnum(str, Enum):
    POSITIVE = 'Positive'
    NEGATIVE = 'Negative'
    NEUTRAL = 'Neutral'

class ArticleModel(Model):
    id = IntField(pk=True)
    title = TextField()
    image_url = TextField(null=True)
    article_url = TextField()
    summary = TextField()
    publication_datetime = CharField(max_length=100)
    ticker = ForeignKeyField ('models.TickerModel') 
    sentiment = CharEnumField(SentimentEnum, max_length=10, null=True)  

    @classmethod
    async def get_paged_articles(cls, page):
        page_size = 10
        offset = (page - 1) * page_size
        return await cls.all().offset(offset).limit(page_size).all()
    
    
    

    
    