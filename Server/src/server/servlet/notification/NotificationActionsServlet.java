package server.servlet.notification;


import engine.api.EngineContext;
import engine.model.rower.Rower;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

@WebServlet(urlPatterns = "/notifications/single")
public class NotificationActionsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String id = req.getParameter("id");
        Rower loggedInUser = EngineContext.getInstance().getRowerBySessionId(req.getRequestedSessionId());

        try (PrintWriter out = resp.getWriter()) {
            if (id != null && loggedInUser != null) {
                loggedInUser.setNotificationWatched(id);
                out.println(Utils.createJsonSuccessObject(true));
            } else {
                out.println(Utils.createJsonErrorObject(false));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String id = reqArgs.get("id");
        Rower loggedInUser = EngineContext.getInstance().getLoggedInUser(req.getRequestedSessionId());

        try (PrintWriter out = resp.getWriter()) {
            if (id != null) {
                loggedInUser.deleteNotification(id);
                out.println(Utils.createJsonSuccessObject(true));
            } else {
                out.println(Utils.createJsonErrorObject(false));
            }
        }
    }
}
