package engine.xml.adapter;


import engine.model.news.AdaptedNewsItem;
import engine.model.news.NewsItem;

import javax.xml.bind.annotation.adapters.XmlAdapter;

public class NewsItemAdapter extends XmlAdapter<AdaptedNewsItem, NewsItem> {

    @Override
    public NewsItem unmarshal(AdaptedNewsItem adaptedNewsItem) throws Exception {
        return new NewsItem(adaptedNewsItem.getContent());
    }

    @Override
    public AdaptedNewsItem marshal(NewsItem newsItem) throws Exception {
        AdaptedNewsItem result = new AdaptedNewsItem();
        result.setId(newsItem.getId());
        result.setContent(newsItem.getContent());
        return result;
    }
}
