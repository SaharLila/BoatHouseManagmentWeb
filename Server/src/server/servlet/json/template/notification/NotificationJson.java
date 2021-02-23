package server.servlet.json.template.notification;

import engine.model.rower.Notification;

import java.time.format.DateTimeFormatter;

public class NotificationJson {

    public String id;
    public String content;
    public String creationTime;
    public String creationDate;
    public boolean isWatched;

    public NotificationJson(Notification notification) {
        this.id = notification.getId();
        this.content = notification.getContent();
        this.creationTime = notification.getCreationTime().format(DateTimeFormatter.ofPattern("hh:mm a"));
        this.creationDate = notification.getCreationDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        this.isWatched = notification.isWatched();
    }
}
