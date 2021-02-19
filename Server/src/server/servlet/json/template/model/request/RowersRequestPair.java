package server.servlet.json.template.model.request;

import server.servlet.json.template.model.rower.RowerJson;

public class RowersRequestPair {
    public final RowerJson rower;
    public final String reqId;

    public RowersRequestPair(RowerJson rower, String requestId) {
        this.rower = rower;
        this.reqId = requestId;
    }
}
