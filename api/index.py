from apscheduler.schedulers.asyncio import AsyncIOScheduler
from .services.ArticleService import process_articles
from .services.TickerService import update_tickers
from .views.ArticleView import ArticleView
from .models.ResponseModel import ResponseModel
from .db import init_db
from fastapi import FastAPI

app = FastAPI()

@app.on_event("startup")
async def startup():
    await init_db()
    # schedule_background_tasks()

@app.get('/api/articles/{page}', response_model=ResponseModel)
async def get_article(page: int):
    return await ArticleView.get_articles(page)

def schedule_background_tasks():
    scheduler = AsyncIOScheduler()
    scheduler.add_job(process_articles_job, 'cron', hour=23, minute=32)
    scheduler.add_job(update_tickers_job, 'cron', hour=20, minute=56)
    scheduler.start()

async def process_articles_job():
    await process_articles()

async def update_tickers_job():
    await update_tickers()
