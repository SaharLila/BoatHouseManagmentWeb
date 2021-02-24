package engine.model.news;

import engine.api.EngineContext;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "NewsItem")
@XmlAccessorType(XmlAccessType.FIELD)
public class NewsItem {

    private static int nextId = 0;
    private int id;
    private String content;

    // For xml
    public NewsItem() {
    }

    public NewsItem(String content) {
        this.content = content;
        this.id = nextId++;
    }

    public static void initId(int id) {
        NewsItem.nextId = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        EngineContext.getInstance().saveEngine();
    }

    public int getId() {
        return this.id;
    }

}
