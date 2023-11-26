from apscheduler.schedulers.background import BackgroundScheduler
from services.ArticleService import process_articles
from services.TickerService import update_tickers
from views.ArticleView import ArticleView
from models.ResponseModel import ResponseModel
from db import init_db
from fastapi import FastAPI
import uvicorn
import asyncio

app = FastAPI()

async def initialize_db():
    await init_db()

def schedule_background_tasks():
    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: asyncio.run(process_articles()), 'cron', hour=13, minute=36)
    scheduler.add_job(lambda: asyncio.run(update_tickers()), 'cron', hour=18, minute=10)
    scheduler.start()

@app.on_event("startup")
async def startup():
    await initialize_db()
    schedule_background_tasks()

@app.get('/articles/{page}', response_model = ResponseModel)
async def get_article(page: int):
    return await ArticleView.get_articles(page)

# sql='''
# SELECT ProductId, Name
# FROM SalesLT.Product
# '''

# cursor = conn.cursor()
# cursor.execute(sql)
# dataset = cursor.fetchall()

# columns = [column[0] for column in cursor.description]
# df = pd.DataFrame(dataset, columns=columns)
# print(df)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)