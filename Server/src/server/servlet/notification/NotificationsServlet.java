package server.servlet.notification;

import engine.api.EngineContext;
import engine.model.rower.Rower;
import server.servlet.json.template.notification.NotificationJson;
import server.servlet.json.template.notification.NotificationsJson;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet(urlPatterns = "/notifications/all")
public class NotificationsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Rower loggedInUser = EngineContext.getInstance().getLoggedInUser(req.getRequestedSessionId());
        try (PrintWriter out = resp.getWriter()) {

            if (!loggedInUser.getNotifications().isEmpty()) {
                List<NotificationJson> result = loggedInUser.getNotifications().stream()
                        .map(NotificationJson::new).collect(Collectors.toList());
                out.println(Utils.createJsonSuccessObject(new NotificationsJson(result)));
            } else {
                out.println(Utils.createJsonSuccessObject(new NotificationsJson(new ArrayList<>())));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Rower loggedInUser = EngineContext.getInstance().getLoggedInUser(req.getRequestedSessionId());
        loggedInUser.cleanNotifications();

        try (PrintWriter out = resp.getWriter()) {
            out.println(Utils.createJsonSuccessObject(true));
        }
    }
}

