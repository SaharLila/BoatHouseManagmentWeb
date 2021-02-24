package engine.xml.adapter;


import engine.model.news.AdaptedNews;
import engine.model.news.News;

import javax.xml.bind.annotation.adapters.XmlAdapter;

public class NewsAdapter extends XmlAdapter<AdaptedNews, News> {

    @Override
    public News unmarshal(AdaptedNews adaptedNews) throws Exception {
        return new News(adaptedNews.getItems());
    }

    @Override
    public AdaptedNews marshal(News news) throws Exception {
        AdaptedNews result = new AdaptedNews();
        result.setItems(news.getItems());
        return result;
    }
}
