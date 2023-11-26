from apscheduler.schedulers.background import BackgroundScheduler
# from services.ArticleService import process_articles
# from services.TickerService import update_tickers
# from views.ArticleView import ArticleView
# from models.ResponseModel import ResponseModel
from db import init_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import os

app = FastAPI()

async def initialize_db():
    await init_db()

@app.on_event("startup")
async def startup():
    await initialize_db()
    # schedule_background_tasks()

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}

sql='''
SELECT ProductId, Name
FROM SalesLT.Product
'''

# cursor = conn.cursor()
# cursor.execute(sql)
# dataset = cursor.fetchall()

# columns = [column[0] for column in cursor.description]
# df = pd.DataFrame(dataset, columns=columns)
# print(df)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)