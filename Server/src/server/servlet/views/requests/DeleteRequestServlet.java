package server.servlet.views.requests;

import engine.api.EngineContext;
import engine.database.collection.RowingActivitiesCollectionManager;
import engine.model.activity.request.Request;
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
import java.util.Date;
import java.util.HashMap;

@WebServlet(urlPatterns = "/requests/delete")
public class DeleteRequestServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String requestToDuplicateId = reqArgs.get("reqId");
        Request reqToDelete = eng.getRequestsCollectionManager()
                .filter(request -> request.getId().equals(requestToDuplicateId)).get(0);


        try (PrintWriter out = resp.getWriter()) {
            if (reqToDelete.getTrainingDate().isBefore(LocalDate.now()) && reqToDelete.isApproved()) {
                deleteRowingActivity(reqToDelete, eng);
            }

            if (eng.getRequestsCollectionManager().remove(reqToDelete)) {
                out.println(Utils.createJsonSuccessObject(true));
            } else {
                out.println(Utils.createJsonErrorObject(null));
            }
        }
    }

    private void deleteRowingActivity(Request req, EngineContext eng) {
        RowingActivity rowingActivity = eng.getRowingActivitiesCollectionManager().
                filter(activity -> activity.getRequest().equals(req)).get(0);

        eng.getRowingActivitiesCollectionManager().remove(rowingActivity);
    }
}
