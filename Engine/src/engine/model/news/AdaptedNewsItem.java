package engine.model.news;

public class AdaptedNewsItem {

    private static int nextId = 0;
    private String content;
    private int id;

    public static int getNextId() {
        return nextId;
    }

    public static void setNextId(int nextId) {
        AdaptedNewsItem.nextId = nextId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}
