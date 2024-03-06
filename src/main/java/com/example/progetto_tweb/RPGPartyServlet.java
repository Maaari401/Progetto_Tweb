package tweb.rpgpc;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tweb.rpgpc.login.LoginService;
import tweb.rpgpc.rpgdb.PartyDB;
import tweb.rpgpc.rpgdb.PartyManagerDB;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@WebServlet(name = "RPGPC-Party-Servlet", urlPatterns = {"/parties", "/parties/member/add", "/parties/member/remove"})
public class RPGPartyServlet extends HttpServlet {

    private Gson gson;

    public void init() {
        gson = new Gson();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String username = LoginService.getCurrentLogin(request.getSession());
        response.setContentType("application/json");

        Map<String, String[]> pars = request.getParameterMap();

        if (request.getServletPath().equals("/parties")) {
            String shortName = "";
            if (pars.containsKey("shortname")) {
                shortName = pars.get("shortname")[0];
            }

            PrintWriter out = response.getWriter();
            if (!shortName.isEmpty()) {
                PartyDB p = PartyManagerDB.getManager().getParty(username, shortName);
                if (p != null) out.println(gson.toJson(p));
                else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else {
                // GET Parties short list
                ArrayList<HashMap<String, String>> list = PartyManagerDB.getManager().getPartiesShort(username);
                out.println(gson.toJson(list));
            }
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        PrintWriter out = response.getWriter();

        if (request.getServletPath().equals("/parties")) {
            String username = LoginService.getCurrentLogin(request.getSession());
            BufferedReader in = request.getReader();
            PartyDB p = gson.fromJson(in, PartyDB.class);
            String val = PartyManagerDB.getManager().addNewParty(username, p);
            if (!val.isEmpty())  {
                p = PartyManagerDB.getManager().getParty(username, p.getShortname());
                if (p != null) out.println(gson.toJson(p));
                else response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
            else response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } else { // request.getServletPath().equals("/parties/member")
            response.sendError(HttpServletResponse.SC_NOT_FOUND); // POST /parties/member not enabled
        }
    }

    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {

        response.setContentType("application/json");
        String username = LoginService.getCurrentLogin(request.getSession());
        Map<String, String[]> pars = request.getParameterMap();
        String shortName = "";
        if (pars.containsKey("shortname")) {
            shortName = pars.get("shortname")[0];
        }

        PrintWriter out = response.getWriter();
        if (!shortName.isEmpty()) {
            boolean deleted = PartyManagerDB.getManager().deleteParty(username, shortName);
            out.println(deleted);
        } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
    }

    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = LoginService.getCurrentLogin(request.getSession());

        PrintWriter out = response.getWriter();

        if (request.getServletPath().equals("/parties")) {
            BufferedReader in = request.getReader();
            PartyDB p = gson.fromJson(in, PartyDB.class);
            boolean ok = PartyManagerDB.getManager().updateParty(username, p);
            if (ok) {
                p = PartyManagerDB.getManager().getParty(username, p.getShortname());
                if (p != null) out.println(gson.toJson(p));
                else response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
            else response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } else if (request.getServletPath().equals("/parties/member/add")) {
            // ADD MEMBER
            BufferedReader in = request.getReader();
            JsonObject obj = JsonParser.parseReader(in).getAsJsonObject();
            int charId = obj.get("character_id").getAsInt();
            String partyName = obj.get("party_name").getAsString();
            boolean added = PartyManagerDB.getManager().addCharacterToParty(username, partyName, charId);
            if (added) {
                PartyDB p = PartyManagerDB.getManager().getParty(username, partyName);
                if (p != null) out.println(gson.toJson(p));
                else response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
            else response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } else if (request.getServletPath().equals("/parties/member/remove")) {
            // REMOVE MEMBER
            BufferedReader in = request.getReader();
            JsonObject obj = JsonParser.parseReader(in).getAsJsonObject();
            int charId = obj.get("character_id").getAsInt();
            String partyName = obj.get("party_name").getAsString();
            boolean removed = PartyManagerDB.getManager().removeCharacterFromParty(username, partyName, charId);
            if (removed) {
                PartyDB p = PartyManagerDB.getManager().getParty(username, partyName);
                if (p != null) out.println(gson.toJson(p));
                else response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
            else response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    public void destroy() {
    }
}