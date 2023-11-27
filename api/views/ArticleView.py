from ..controllers.ArticleController import ArticleController
from ..models.ResponseModel import ResponseModel

class ArticleView:

    @classmethod
    async def get_articles(cls, page):
        message, response, status = await ArticleController.fetch_articles(1 if page <= 0 else page)
        return ResponseModel(message=message, articles=response, code=status)
        
        

  