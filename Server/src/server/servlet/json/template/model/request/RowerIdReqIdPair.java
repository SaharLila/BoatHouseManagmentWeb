package server.servlet.json.template.model.request;

public class RowerIdReqIdPair {

    public final String rowerSerialNumber;
    public final String reqId;

    public RowerIdReqIdPair(String rowerSerialNumber, String reqId) {
        this.rowerSerialNumber = rowerSerialNumber;
        this.reqId = reqId;
    }
}
