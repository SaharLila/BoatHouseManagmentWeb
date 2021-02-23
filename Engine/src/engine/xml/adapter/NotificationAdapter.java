package engine.xml.adapter;

import engine.model.rower.AdaptedNotification;
import engine.model.rower.Notification;

import javax.xml.bind.annotation.adapters.XmlAdapter;

public class NotificationAdapter extends XmlAdapter<AdaptedNotification, Notification> {

    @Override
    public Notification unmarshal(AdaptedNotification adaptedNotification) throws Exception {
        return new Notification(adaptedNotification.getId(), adaptedNotification.getContent(),
                adaptedNotification.getCreationDate(), adaptedNotification.getCreationTime(),
                adaptedNotification.isWatched());
    }

    @Override
    public AdaptedNotification marshal(Notification notification) throws Exception {
        AdaptedNotification result = new AdaptedNotification();
        result.setId(notification.getId());
        result.setContent(notification.getContent());
        result.setCreationDate(notification.getCreationDate());
        result.setCreationTime(notification.getCreationTime());
        result.setIsWatched(notification.isWatched());
        return result;
    }
}
