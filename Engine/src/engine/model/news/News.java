package engine.model.news;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class News {

    private List<NewsItem> items;

    public News() {
        this.items = new ArrayList<>();
    }

    public void addItem(NewsItem item) {
        this.items.add(item);
    }

    public List<NewsItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    public void removeById(int itemToDeleteId) {
        List <NewsItem> oneItemList = this.items.stream().filter(newsItem -> newsItem.getId() == itemToDeleteId).collect(Collectors.toList());
        if(!oneItemList.isEmpty()){
            this.items.remove(oneItemList.get(0));
        }
    }
}
