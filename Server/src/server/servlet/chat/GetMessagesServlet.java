package server.servlet.chat;

import engine.api.EngineContext;
import server.chat.Chat;
import server.chat.Message;
import server.constant.Constants;
import server.servlet.json.chat.ChatMessagesJson;
import server.servlet.json.chat.MessageJson;
import server.servlet.json.chat.VersionJson;
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

        try (PrintWriter out = resp.getWriter()) {
            if (chat != null) {
                VersionJson result = new VersionJson(chat.getVersion(), chat.getTotalCount());
                out.println(Utils.createJsonSuccessObject(result));
            } else {
                out.println(Utils.createJsonErrorObject(null));
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Chat chat = (Chat) req.getServletContext().getAttribute(Constants.chatAtt);
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String clientChatVersion = reqArgs.get("version");
        String mySerial = EngineContext.getInstance().getLoggedInUser(req.getRequestedSessionId()).getSerialNumber();

        try (PrintWriter out = resp.getWriter()) {
            if (chat != null && clientChatVersion != null) {

                Integer version = Integer.parseInt(clientChatVersion);
                List<Message> messageList = chat.getRelevantMessages(version);
                List<MessageJson> result = messageList.stream().map(MessageJson::new).collect(Collectors.toList());
                result.forEach(msg -> {
                    if (msg.creator.serialNumber.equals(mySerial)) {
                        msg.isMine = true;
                    }
                });
                out.println(Utils.createJsonSuccessObject(new ChatMessagesJson(result)));

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
