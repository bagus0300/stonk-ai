from tortoise.models import Model
from tortoise.fields import (
    IntField, CharField, FloatField
)

class TickerModel(Model):
    id = IntField(pk=True, generated=True)
    market_date = CharField(max_length=100)
    ticker = CharField(max_length=10, null=True)  
    open_price = FloatField(null=True)
    close_price = FloatField(null=True)

    class Meta:
        table = "ticker_model"


    
    
    