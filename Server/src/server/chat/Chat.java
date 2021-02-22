package server.chat;

import engine.model.rower.Rower;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Chat {

    private final List<Message> messages;

    public Chat() {
        this.messages = new ArrayList<>();
    }

    public List<Message> getMessages() {
        return messages;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Chat chat = (Chat) o;
        return messages.equals(chat.messages);
    }

    @Override
    public int hashCode() {
        return Objects.hash(messages);
    }

    public void addMessage(String message, Rower creator) {
        Message msg = new Message(message, creator);
        this.messages.add(msg);
    }

    public List<Message> getAllMessages() {
        return this.messages;
    }

    public List<Message> getRelevantMessages(int version) {
        if (this.messages.isEmpty() || this.messages.size() == version) {
            return new ArrayList<>();
        } else {
            return this.messages.subList(version, messages.size());
        }
    }

    public int getTotalCount() {
        return this.messages.size();
    }
}
