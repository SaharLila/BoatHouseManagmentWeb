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
import java.util.stream.Collectors;

@WebServlet(urlPatterns = "/news/update")
public class UpdateNewsItemServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String newContent = reqArgs.get("newContent");
        String newsItemIdString = reqArgs.get("itemId");
        int newsItemId = Integer.parseInt(newsItemIdString);

        try (PrintWriter out = resp.getWriter()) {
            NewsItem newsItemToUpdate = eng.getNews().getItems().stream()
                    .filter(newsItem -> newsItem.getId() == newsItemId).collect(Collectors.toList()).get(0);
            newsItemToUpdate.setContent(newContent);

            eng.addNotificationToAllUsers("A message from the news inbox was changed");
            out.println(Utils.createJsonSuccessObject(true));
        }
    }
}
