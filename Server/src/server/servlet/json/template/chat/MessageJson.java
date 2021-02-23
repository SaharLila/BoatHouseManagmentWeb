package server.servlet.json.template.chat;

import server.chat.Message;

import java.time.format.DateTimeFormatter;

public class MessageJson {

    public String content;
    public String creator;
    public String creatorSerial;
    public String date;
    public Boolean isMine = false;

    public MessageJson(Message message) {
        this.content = message.getMessage();
        this.creator = message.getSender().getName();
        this.creatorSerial = message.getSender().getSerialNumber();
        this.date = message.getCreationTime().format(DateTimeFormatter.ofPattern("dd/MM/yyyy hh:mm"));
    }

    public void setIsMine(boolean value) {
        this.isMine = value;
    }
}
