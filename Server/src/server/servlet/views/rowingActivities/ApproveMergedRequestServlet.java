package server.servlet.views.rowingActivities;

import com.google.gson.Gson;
import engine.api.EngineContext;
import engine.model.activity.request.Request;
import engine.model.activity.request.RequestModifier;
import engine.model.activity.rowing.RowingActivity;
import engine.model.boat.Boat;
import engine.model.rower.Rower;
import server.servlet.json.template.model.request.RowerIdReqIdPair;
import server.servlet.json.template.model.rowing.activity.RowingActivityJson;
import server.utils.Utils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

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

                List<String> ListOfRowerReqStringIds = gson.fromJson(reqArgsMap.get("rowersReqIdList"), List.class);
                List<RowerIdReqIdPair> rowersRequestPairsList = ListOfRowerReqStringIds.stream()
                        .map(entry -> gson.fromJson(entry, RowerIdReqIdPair.class)).collect(Collectors.toList());

                rowersRequestPairsList
                        .forEach(rowersRequestPair -> handleRowerReqIdPair(rowersRequestPair, eng, reqToApproveModifier));

                RowingActivity rowingActivityToAdd = new RowingActivity(theBoat, requestToApprove);
                if(eng.getRowingActivitiesCollectionManager().add(rowingActivityToAdd)){
                    rowingActivityToAdd.getRequest().getAllRowers()
                            .forEach(rower -> eng.addUserNotification(rower,
                                    "A request that you were registered to has been approved."));
                    out.println(Utils.createJsonSuccessObject(new RowingActivityJson(rowingActivityToAdd)));
                }else {
                    out.println(Utils.createJsonErrorObject(null));
                }

            } catch (Exception e) {
                out.println(Utils.createJsonErrorObject(null));
            }
        }
    }


    private void handleRowerReqIdPair(RowerIdReqIdPair rowersRequestPair, EngineContext eng, RequestModifier requestToApprove) {
        String reqToRemoveFromId = rowersRequestPair.reqId;
        Rower rowerToMove = eng.getRowersCollectionManager()
                .findRowerBySerialNumber(rowersRequestPair.rowerSerialNumber);
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
