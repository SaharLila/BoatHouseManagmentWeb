package server.servlet.general.news;

import engine.api.EngineContext;
import engine.model.news.NewsItem;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;


@WebServlet(urlPatterns = "/news/add")
public class AddNewsItemServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String messageToAdd = reqArgs.get("content");

        try (PrintWriter out = resp.getWriter()) {
            NewsItem newsItemToAdd = new NewsItem(messageToAdd);
            eng.getNews().addItem(newsItemToAdd);
            eng.addNotificationToAllUsers("A new message was added to the news inbox");
            out.println(Utils.createJsonSuccessObject(newsItemToAdd.getId()));
        }
    }
}
