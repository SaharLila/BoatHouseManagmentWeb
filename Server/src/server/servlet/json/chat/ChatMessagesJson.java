package server.servlet.json.chat;

import java.util.List;

public class ChatMessagesJson {

    public final List<MessageJson> messages;
    public final int version;

    public ChatMessagesJson(List<MessageJson> messages, int version) {
        this.messages = messages;
        this.version = version;
    }
}
