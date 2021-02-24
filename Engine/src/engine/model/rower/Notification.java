package engine.model.rower;

import engine.xml.adapter.LocalDateAdapter;
import engine.xml.adapter.LocalTimeAdapter;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@XmlRootElement(name = "Notification")
@XmlAccessorType(XmlAccessType.FIELD)
public class Notification implements Serializable {

    private final String id;
    private final String content;
    @XmlJavaTypeAdapter(LocalDateAdapter.class)
    private final LocalDate creationDate;
    @XmlJavaTypeAdapter(LocalTimeAdapter.class)
    private final LocalTime creationTime;
    private boolean isWatched = false;

    // XML only
    public Notification() {
        this.id = null;
        this.content = null;
        this.creationDate = null;
        this.creationTime = null;
    }

    public Notification(String content) {
        this.id = UUID.randomUUID().toString();
        this.content = content;

        this.creationDate = LocalDate.now();
        this.creationTime = LocalTime.now();
        this.isWatched = false;
    }

    public Notification(String id, String content, LocalDate creationDate, LocalTime creationTime, boolean isWatched) {
        this.id = id;
        this.content = content;
        this.creationDate = creationDate;
        this.creationTime = creationTime;
        this.isWatched = isWatched;
    }

    public boolean isWatched() {
        return isWatched;
    }

    public void setWatched() {
        this.isWatched = true;
    }

    public String getId() {
        return id;
    }

    public String getContent() {
        return content;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public LocalTime getCreationTime() {
        return creationTime;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return new Notification(this.id, this.getContent(),
                this.getCreationDate(), this.getCreationTime(), this.isWatched);
    }
}
