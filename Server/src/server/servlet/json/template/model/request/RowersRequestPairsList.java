package server.servlet.json.template.model.request;

import engine.model.rower.Rower;
import server.servlet.json.template.model.rower.RowerJson;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RowersRequestPairsList {
    public List<RowersRequestPair> pairs = new ArrayList<>();

    public RowersRequestPairsList(Map<Rower, String> map) {
        map.forEach((key, value) -> pairs.add(new RowersRequestPair(new RowerJson(key), value)));
    }
}
