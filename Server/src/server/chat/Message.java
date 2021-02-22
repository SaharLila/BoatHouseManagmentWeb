package server.chat;

import engine.model.rower.Rower;

import java.time.LocalDateTime;
import java.util.Objects;

public class Message {
    private final String message;
    private final LocalDateTime creationTime;
    private final Rower sender;

    public Message(String message, Rower sender) {
        this.message = message;
        this.creationTime = LocalDateTime.now();
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreationTime() {
        return creationTime;
    }

    public Rower getSender() {
        return sender;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Message message1 = (Message) o;
        return message.equals(message1.message) &&
                creationTime.equals(message1.creationTime) &&
                sender.equals(message1.sender);
    }

    @Override
    public int hashCode() {
        return Objects.hash(message, creationTime, sender);
    }
}
