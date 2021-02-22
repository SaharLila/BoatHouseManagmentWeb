package server.chat;

import engine.model.rower.Rower;
import javafx.util.Pair;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class Chat {

    private final List<Pair<Integer, Message>> messages;
    private int version;

    public Chat() {
        this.messages = new ArrayList<>();
        this.version = hashCode();
    }

    public List<Pair<Integer, Message>> getMessages() {
        return messages;
    }

    public Integer getVersion() {
        return version;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Chat chat = (Chat) o;
        return messages.equals(chat.messages) &&
                version == chat.version;
    }

    @Override
    public int hashCode() {
        return Objects.hash(messages, version);
    }

    private void refreshVersion() {
        version = hashCode() ^ this.messages.get(messages.size() - 1).hashCode();
    }

    public void addMessage(String message, Rower creator) {
        Message msg = new Message(message, creator);
        this.messages.add(new Pair<>(version, msg));
        refreshVersion();
    }

    public List<Message> getAllMessages() {
        List<Message> result = new ArrayList<>();

        for (Pair<Integer, Message> pair : this.messages) {
            result.add(pair.getValue());
        }

        return result;
    }

    public List<Message> getRelevantMessages(Integer version) {

        Pair<Integer, Message> pair = this.messages.stream()
                .filter(messages -> messages.getKey().equals(version))
                .findFirst().orElse(null);

        int index = pair != null ? this.messages.indexOf(pair) : 0;

        return this.messages.subList(index, this.messages.size() - 1).stream()
                .map(Pair::getValue).collect(Collectors.toList());
    }

    public int getTotalCount() {
        return this.messages.size();
    }
}
