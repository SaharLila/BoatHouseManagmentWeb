package server.servlet.collector.boat;

import com.google.gson.Gson;
import engine.api.EngineContext;
import engine.model.boat.Boat;
import server.servlet.json.template.model.boat.BoatsJson;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(urlPatterns = "/collectors/boats")
public class BoatsCollector extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        EngineContext eng = EngineContext.getInstance();
        List<Boat> boats = eng.getBoatsCollectionManager().toArrayList();

        try(PrintWriter out = resp.getWriter()){
            out.print(new Gson().toJson(new BoatsJson(boats)));
        }
    }
}
