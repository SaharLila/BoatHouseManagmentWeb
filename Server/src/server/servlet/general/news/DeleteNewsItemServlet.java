package server.servlet.general.news;

import engine.api.EngineContext;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;


@WebServlet(urlPatterns = "/news/delete")
public class DeleteNewsItemServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String itemToDeleteIdString = reqArgs.get("itemToDeleteId");
        int itemToDeleteId = Integer.parseInt(itemToDeleteIdString);

        try (PrintWriter out = resp.getWriter()) {
            eng.getNews().removeById(itemToDeleteId);

            out.println(Utils.createJsonSuccessObject(true));
        }
    }
}
