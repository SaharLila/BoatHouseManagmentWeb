package server.servlet.json.chat;

public class VersionJson {

    public final Integer version;
    public final Integer count;

    public VersionJson(Integer version, Integer count) {
        this.version = version;
        this.count = count;
    }
}
