package server.servlet.json.news;

import engine.model.news.News;

import java.util.ArrayList;
import java.util.List;

public class NewsJson {

    public final List<NewsItemJson> items;

    public NewsJson(News news){
        this.items = new ArrayList<>();
        news.getItems().forEach(newsItem -> this.items.add(new NewsItemJson(newsItem)));
    }
}
