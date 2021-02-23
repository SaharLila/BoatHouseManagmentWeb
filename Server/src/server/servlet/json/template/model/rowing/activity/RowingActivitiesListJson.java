package server.servlet.json.template.model.rowing.activity;

import engine.model.activity.rowing.RowingActivity;

import java.util.ArrayList;
import java.util.List;


public class RowingActivitiesListJson {
    public List<RowingActivityJson> activities = new ArrayList<>();

    public RowingActivitiesListJson(List<RowingActivity> rowingActivities){
        for (RowingActivity activity : rowingActivities) {
            this.activities.add(new RowingActivityJson(activity));
        }
    }
}
