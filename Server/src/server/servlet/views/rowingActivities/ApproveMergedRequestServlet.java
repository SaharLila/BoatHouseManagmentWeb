package server.servlet.views.rowingActivities;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.sun.org.apache.xerces.internal.util.HTTPInputSource;
import engine.api.EngineContext;
import engine.model.activity.request.Request;
import engine.model.activity.request.RequestModifier;
import engine.model.activity.rowing.RowingActivity;
import engine.model.boat.Boat;
import engine.model.rower.Rower;
import server.servlet.json.template.model.request.RowersRequestPair;
import server.servlet.json.template.model.request.RowersRequestPairsList;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

@WebServlet(urlPatterns = "/rowing-activities/approveMergedRequest")
public class ApproveMergedRequestServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();
        HashMap<String, String> reqArgsMap = Utils.parsePostData(req);
        Gson gson = new Gson();
        String reqToApproveId = reqArgsMap.get("reqId");
        String boatSerialNumber = reqArgsMap.get("boatSerialNumber");

        try (PrintWriter out = resp.getWriter()) {
            try {
                Request requestToApprove = eng.getRequestsCollectionManager()
                        .filter(request -> request.getId().equals(reqToApproveId)).get(0);
                RequestModifier reqToApproveModifier = eng.getRequestModifier(requestToApprove, null);
                Boat theBoat = eng.getBoatsCollectionManager()
                        .filter(boat -> boat.getSerialNumber().equals(boatSerialNumber)).get(0);

                String[][] rowersRequestPairsList = gson.fromJson(reqArgsMap.get("rowersReqIdList"), String[][].class);



//                rowersRequestPairsList.pairs.forEach(rowersRequestPair -> handleRowerReqIdPair(rowersRequestPair, eng, reqToApproveModifier));

                out.println(Utils.createJsonSuccessObject(eng.getRowingActivitiesCollectionManager()
                        .add(new RowingActivity(theBoat, requestToApprove))));

            } catch (Exception e) {
                out.println(Utils.createJsonErrorObject(null));
            }
        }
    }


    private void handleRowerReqIdPair(RowersRequestPair rowersRequestPair, EngineContext eng, RequestModifier requestToApprove) {
        String reqToRemoveFromId = rowersRequestPair.reqId;
        Rower rowerToMove = eng.getRowersCollectionManager()
                .findRowerBySerialNumber(rowersRequestPair.rower.serialNumber);
        Request reqToRemoveFrom = eng.getRequestsCollectionManager()
                .filter(request -> request.getId().equals(reqToRemoveFromId)).get(0);

        RequestModifier reqToRemoveFromModifier = eng.getRequestModifier(reqToRemoveFrom, null);

        if (reqToRemoveFrom.getMainRower().equals(rowerToMove)) {
            reqToRemoveFromModifier.removeMainRower();
        } else {
            reqToRemoveFromModifier.removeRowerFromOtherRowersList(rowerToMove);
        }

        requestToApprove.addRowerToRequest(rowerToMove);
    }
}
