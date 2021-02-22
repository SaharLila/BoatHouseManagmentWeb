package server.servlet.json.chat;

import java.util.List;

public class ChatMessagesJson {

    List<MessageJson> messages;

    public ChatMessagesJson(List<MessageJson> messages) {
        this.messages = messages;
    }
}
