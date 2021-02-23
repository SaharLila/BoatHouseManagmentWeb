package server.servlet.json.news;

import engine.model.news.NewsItem;

import java.util.Objects;

public class NewsItemJson {

    public final int id;
    public final String content;


    public NewsItemJson(NewsItem item){
        this.content = item.getContent();
        this.id = item.getId();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NewsItemJson that = (NewsItemJson) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
