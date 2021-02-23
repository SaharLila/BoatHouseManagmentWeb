package server.servlet.general.news;

import com.google.gson.Gson;
import engine.api.EngineContext;
import server.servlet.json.news.NewsJson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;


@WebServlet(urlPatterns = "/news/get")
public class GetNewsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();

        try (PrintWriter out = resp.getWriter()) {
            out.println(new Gson().toJson(new NewsJson(eng.getNews())));
        }
    }
}
