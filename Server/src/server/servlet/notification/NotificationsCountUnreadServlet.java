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

@WebServlet(urlPatterns = "/notifications/countUnread")
public class NotificationsCountUnreadServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Rower loggedInUser = EngineContext.getInstance().getLoggedInUser(req.getRequestedSessionId());

        try (PrintWriter out = resp.getWriter()) {
            if (!loggedInUser.getNotifications().isEmpty()) {
                int count = (int) loggedInUser.getNotifications().stream()
                        .filter(notification -> !notification.isWatched()).count();
                out.println(Utils.createJsonSuccessObject(count));
            } else {
                out.println(Utils.createJsonSuccessObject(0));
            }
        }
    }
}
