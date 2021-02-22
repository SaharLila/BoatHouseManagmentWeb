package server.servlet.chat;

import engine.api.EngineContext;
import server.chat.Chat;
import server.constant.Constants;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

@WebServlet(urlPatterns = "/chat/send")
public class SendMessageServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Chat chat = (Chat) req.getServletContext().getAttribute(Constants.chatAtt);
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String messageContent = reqArgs.get("message");

        chat.addMessage(messageContent, EngineContext.getInstance()
                .getLoggedInUser(req.getRequestedSessionId()));

        try (PrintWriter out = resp.getWriter()) {
            out.println(Utils.createJsonSuccessObject(null));
        }
    }
}
