package engine.model.news;

public class NewsItem {
    private static int nextId = 0;

    private String content;
    private final int id;

    public NewsItem(String content) {
        this.content = content;
        this.id = nextId++;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public int getId() {
        return this.id;
    }
}
