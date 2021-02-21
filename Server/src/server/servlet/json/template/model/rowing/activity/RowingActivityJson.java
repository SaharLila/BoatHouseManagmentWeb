package server.servlet.json.template.model.rowing.activity;

import engine.model.activity.rowing.RowingActivity;
import server.servlet.json.template.model.boat.BoatJson;
import server.servlet.json.template.model.request.RequestJson;

public class RowingActivityJson {
    public final RequestJson request;
    public final BoatJson boat;
    public final String id;

    public RowingActivityJson(RowingActivity activity) {
        this.request = new RequestJson(activity.getRequest());
        this.boat = new BoatJson(activity.getBoat());
        this.id = activity.getId();
    }
}
