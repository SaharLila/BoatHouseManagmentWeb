package server.servlet.json.template.notification;

import java.util.List;

public class NotificationsJson {

    public final List<NotificationJson> notifications;

    public NotificationsJson(List<NotificationJson> notifications) {
        this.notifications = notifications;
    }
}
