from dotenv import load_dotenv
import os
from tortoise import Tortoise

load_dotenv()

username = "marvindeng"
password = os.getenv('PASSWORD')
host = "finance-news.database.windows.net"
port = "1433"
database_name = "News"

connection_string = (
    f'mssql://{username}:{password}@{host}:{port}/{database_name}'
    f'?driver=ODBC+Driver+18+for+SQL+Server&encrypt=yes'
    f'&trust_server_certificate=no&connection_timeout=30'
)

DB_CONFIG = {
    "connections": {
        "default": connection_string,
    },
    "apps": {
        "models": {
            "models": ["models.ArticleModel", "models.TickerModel"],
            "default_connection": "default",
        }
    }
}

async def init_db():
    await Tortoise.init(
        config=DB_CONFIG
    )
    print("done")
    await Tortoise.generate_schemas()


