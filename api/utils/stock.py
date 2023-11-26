import requests
import pytz
from datetime import datetime, timedelta, time
from dotenv import load_dotenv
import os

load_dotenv()

class StockAPI:

    @classmethod
    def get_eod_data(cls, ticker, date_str):
        try:
            base_url = "http://api.marketstack.com/v1/eod"
            url = f"{base_url}/{date_str}"
            params = {
                "access_key": os.getenv("MARKETSTACK_KEY"),
                "symbols": ticker
            }
            response = requests.get(url, params=params)
            response.raise_for_status()  
            return response.json()
        
        except Exception:
            return None
        
    @classmethod
    def get_market_date(cls, article_datetime):
        published_date = article_datetime.date()

        if published_date.weekday() >= 5 or (published_date.weekday() == 4 and StockAPI.after_market_closed(article_datetime)):
            return StockAPI.get_next_monday(published_date) 
            
        elif cls.after_market_closed(article_datetime):
            return published_date + timedelta(days=1) 
        
        return published_date

    @staticmethod
    def after_market_closed(article_datetime):
        et_market_close = time(16, 0)
        et_day_end = time(23, 59) 

        utc_market_close = StockAPI.convert_ET_to_UTC(article_datetime.date(), et_market_close)
        utc_day_end = StockAPI.convert_ET_to_UTC(article_datetime.date(), et_day_end)
        utc_article_datetime = article_datetime.replace(tzinfo=pytz.utc)

        if utc_market_close < utc_article_datetime and utc_article_datetime <= utc_day_end:
            return True
        
        return False

    @staticmethod
    def convert_ET_to_UTC(date, time):
        et_datetime = datetime.combine(date, time)
        et_timezone = pytz.timezone('US/Eastern')
        utc_datetime = et_timezone.localize(et_datetime).astimezone(pytz.utc)
        return utc_datetime

    @staticmethod
    def get_next_monday(date):
        days_until_monday = (7 - date.weekday()) % 7
        next_monday = date + timedelta(days=days_until_monday)
        return next_monday

    @classmethod
    def get_open_close(cls, ticker, date):
        eod_data = StockAPI.get_eod_data(ticker, date) 
        open_price, close_price = None, None
        
        if eod_data is not None and "data" in eod_data and len(eod_data["data"]) > 0:
            open_price = eod_data["data"][0]["open"]
            close_price = eod_data["data"][0]["close"]
            
        return open_price, close_price
            

        
    
