package server.servlet.views.rowingActivities;

import engine.api.EngineContext;
import engine.model.activity.rowing.RowingActivity;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.HashMap;

@WebServlet(urlPatterns = "/rowing-activities/delete")
public class DeleteRowingActivityServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String RowingActivityToDeleteId = reqArgs.get("activityId");
        RowingActivity activityToDelete = eng.getRowingActivitiesCollectionManager()
                .filter(activity -> activity.getId().equals(RowingActivityToDeleteId)).get(0);

        try (PrintWriter out = resp.getWriter()) {
            if (eng.getRowingActivitiesCollectionManager().remove(activityToDelete)) {
                if (activityToDelete.getRequest().getTrainingDate().isAfter(LocalDate.now())) {
                    activityToDelete.getRequest().getAllRowers()
                            .forEach(rower -> eng.addUserNotification(rower,
                                    "A rowing activity that you were registered to has been cancelled."));
                }
                out.println(Utils.createJsonSuccessObject(true));
            } else {
                out.println(Utils.createJsonErrorObject(null));
            }
        }
    }
}

