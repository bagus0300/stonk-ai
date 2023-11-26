from controllers.TickerController import TickerController
import datetime

async def update_tickers():
    date_today = datetime.date.today().strftime("%Y-%m-%d")
    await TickerController.update_tickers(date_today)
    
