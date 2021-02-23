package server.servlet.chat;

import engine.api.EngineContext;
import server.chat.Chat;
import server.chat.Message;
import server.constant.Constants;
import server.servlet.json.template.chat.ChatMessagesJson;
import server.servlet.json.template.chat.MessageJson;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet(urlPatterns = "/chat/receive")
public class GetMessagesServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Chat chat = (Chat) req.getServletContext().getAttribute(Constants.chatAtt);
        int result = chat.getTotalCount();
        Object initialValue = req.getSession().getAttribute(Constants.initChatVersion);

        if (initialValue != null) {
            result = Integer.parseInt(initialValue.toString());
        } else {
            req.getSession().setAttribute(Constants.initChatVersion, Integer.toString(chat.getTotalCount()));
        }

        try (PrintWriter out = resp.getWriter()) {
            out.println(Utils.createJsonSuccessObject(result));
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Chat chat = (Chat) req.getServletContext().getAttribute(Constants.chatAtt);
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String mySerial = EngineContext.getInstance().getLoggedInUser(req.getRequestedSessionId()).getSerialNumber();

        try (PrintWriter out = resp.getWriter()) {
            int clientChatVersion = Integer.parseInt(reqArgs.get("version"));

            if (chat != null) {
                List<Message> messageList = chat.getRelevantMessages(clientChatVersion);
                List<MessageJson> result = messageList.stream().map(MessageJson::new).collect(Collectors.toList());
                result.forEach(msg -> {
                    if (msg.creatorSerial.equals(mySerial)) {
                        msg.isMine = true;
                    }
                });
                out.println(Utils.createJsonSuccessObject(new ChatMessagesJson(result, chat.getTotalCount())));

            } else {
                out.println(Utils.createJsonErrorObject("Couldn't load chat data due to an unknown reason."));
            }
        } catch (Exception ex) {
            try (PrintWriter out = resp.getWriter()) {
                out.println(Utils.createJsonErrorObject("Couldn't load chat data due to an unknown reason."));
            }
        }
    }
}
