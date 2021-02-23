package server.servlet;

import engine.api.EngineContext;
import server.constant.ePages;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


//TODO -> למחוק לפני הגשה

@WebServlet(urlPatterns = "/test")
public class TestServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext.getInstance().getRowersCollectionManager().get(0).addNotification("test notification");
        Utils.renderLayout(req, resp, "/public/html/test.html", ePages.ROWERS);
    }
}
