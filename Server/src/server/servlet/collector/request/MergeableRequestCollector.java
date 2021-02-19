package server.servlet.collector.request;

import engine.api.EngineContext;
import engine.model.activity.request.Request;
import engine.model.boat.Boat;
import engine.model.rower.Rower;
import server.servlet.json.template.model.request.RowersRequestPairsList;
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
import java.util.Map;

@WebServlet(urlPatterns = "/collectors/requests/mergeable")
public class MergeableRequestCollector extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();
        HashMap<String, String> reqArgs = Utils.parsePostData(req);
        String reqToApproveId = reqArgs.get("reqId");
        String boatSerialNumber = reqArgs.get("boatSerialNumber");
        try (PrintWriter out = resp.getWriter()) {
            try {
                Request reqToApprove = eng.getRequestsCollectionManager()
                        .filter(request -> request.getId().equals(reqToApproveId)).get(0);
                Boat theBoat = eng.getBoatsCollectionManager()
                        .filter(boat -> boat.getSerialNumber().equals(boatSerialNumber)).get(0);
                Map<Rower, String> result = getRowersReqIdMap(eng, reqToApprove, theBoat.getBoatType());

                out.println(Utils.createJsonSuccessObject(new RowersRequestPairsList(result)));
            } catch (Exception e) {
                out.println(Utils.createJsonErrorObject("Finding new rowers to merge with failed due to unknown error"));
            }
        }
    }


    private Map<Rower, String> getRowersReqIdMap(EngineContext eng, Request reqToApprove, Boat.eBoatType boatType) {
        List<Request> optionalRequestsToMerge = eng.getRequestsCollectionManager()
                .filter(request -> request.getTrainingDate().equals(reqToApprove.getTrainingDate()) &&
                        request.getWeeklyActivityActivity().getStartTime().equals(reqToApprove.getWeeklyActivityActivity().getStartTime()) &&
                        request.getWeeklyActivityActivity().getEndTime().equals(reqToApprove.getWeeklyActivityActivity().getEndTime()) &&
                        request.getBoatTypesList().contains(boatType) &&
                        !request.equals(reqToApprove) &&
                        !request.isApproved());

        Map<Rower, String> rowersReqIdMap = new HashMap<>();

        optionalRequestsToMerge.forEach(requestToMerge -> {
            String reqToMergeID = requestToMerge.getId();
            requestToMerge.getAllRowers().stream()
                    .filter(rower -> !reqToApprove.getAllRowers().contains(rower))
                    .forEach(rower -> rowersReqIdMap.put(rower, reqToMergeID));
        });

        return rowersReqIdMap;
    }
}
