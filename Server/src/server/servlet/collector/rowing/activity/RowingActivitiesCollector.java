package server.servlet.collector.rowing.activity;

import com.google.gson.Gson;
import engine.api.EngineContext;
import engine.model.activity.rowing.RowingActivity;
import server.servlet.json.template.model.rowing.activity.RowingActivitiesListJson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(urlPatterns = "/collectors/rowing-activities")
public class RowingActivitiesCollector extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();
        List<RowingActivity> activities = eng.getRowingActivitiesCollectionManager().toArrayList();

        try (PrintWriter out = resp.getWriter()) {
            out.print(new Gson().toJson(new RowingActivitiesListJson(activities)));
        }
    }
}
