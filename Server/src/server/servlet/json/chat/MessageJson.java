package server.servlet.json.chat;

import server.chat.Message;
import server.servlet.json.template.model.rower.RowerJson;

import java.time.format.DateTimeFormatter;

public class MessageJson {

    public String content;
    public RowerJson creator;
    public String date;
    public Boolean isMine = false;

    public MessageJson(Message message) {
        this.content = message.getMessage();
        this.creator = new RowerJson(message.getSender());
        this.date = message.getCreationTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm"));
    }

    public void setIsMine(boolean value) {
        this.isMine = value;
    }
}
