package engine.model.rower;


import java.time.LocalDate;
import java.time.LocalTime;

public class AdaptedNotification {

    private String id;
    private String content;
    private LocalDate creationDate;
    private LocalTime creationTime;
    private boolean isWatched;

    public boolean isWatched() {
        return isWatched;
    }

    public void setIsWatched(boolean state) {
        isWatched = state;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public LocalTime getCreationTime() {
        return creationTime;
    }

    public void setCreationTime(LocalTime creationTime) {
        this.creationTime = creationTime;
    }
}
