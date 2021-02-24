package engine.model.news;

import engine.api.EngineContext;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@XmlRootElement(name = "News")
@XmlAccessorType(XmlAccessType.FIELD)
public class News {

    private final List<NewsItem> items;

    public News() {
        this.items = new ArrayList<>();
    }

    public News(List<NewsItem> items) {
        this.items = items;
    }

    public void addItem(NewsItem item) {
        this.items.add(item);
        EngineContext.getInstance().saveEngine();
    }

    public List<NewsItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public void removeById(int itemToDeleteId) {
        List<NewsItem> oneItemList = this.items.stream().filter(newsItem -> newsItem.getId() == itemToDeleteId).collect(Collectors.toList());
        if (!oneItemList.isEmpty()) {
            this.items.remove(oneItemList.get(0));
            EngineContext.getInstance().saveEngine();
        }
    }
}
