package com.example.progetto_tweb.login;

import com.example.progetto_tweb.Manager.ManagerDB;
import com.example.progetto_tweb.token.tokenManager;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;


@WebServlet(name = "Login/logout-Servlet", urlPatterns = {"/login", "/logout"})
public class LoginServlet extends HttpServlet {

    private static final String LOGOUT_PATH = "/logout";
    private static final String LOGIN_PATH = "/login";

    public void init() {

    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        // GET accetta sia /login che /logout
        // GET /login restituisce il login status corrente
        // GET /logout effettua il logout e restituisce l'esito
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        String token = request.getHeader("token");



        if (request.getServletPath().equals(LOGIN_PATH)) {
            JsonObject result = new JsonObject();
            result.addProperty("operation", "status");
            result.addProperty("token", token);
            result.addProperty("success", true);
            result.addProperty("error", false);
            result.addProperty("errorMessage", "");
            out.println(result);
        } else if (request.getServletPath().equals(LOGOUT_PATH)) {
            JsonObject result = new JsonObject();
            String username = tokenManager.getUsernameFromToken(token);
            if (!username.isEmpty()) {
                tokenManager.doLogOut(username);
                result.addProperty("operation", "logout");
                result.addProperty("token", "");
                result.addProperty("success", true);
                result.addProperty("error", false);
                result.addProperty("errorMessage", "");
            } else {
                result.addProperty("operation", "logout");
                result.addProperty("username", "");
                result.addProperty("success", false);
                result.addProperty("error", true);
                result.addProperty("errorMessage", "No logged user");
            }
            out.println(result);
        }

    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // POST accetta solo il path /login
        // per fare /logout si usa GET
        if (request.getServletPath().equals(LOGIN_PATH)) {
            response.setContentType("application/json");
            BufferedReader in = request.getReader();
            JsonObject loginObject = JsonParser.parseReader(in).getAsJsonObject();

            String username = loginObject.get("username").getAsString();
            String password = loginObject.get("password").getAsString();
            JsonObject result = new JsonObject();
            boolean valid = ManagerDB.getManager().validateCredentials(username, password);
            if (valid) {
                boolean auth = ManagerDB.getManager().checkAuth(username, password);
                /*if (previous.isEmpty())*/
                String token = tokenManager.addToken(username, auth);
                if(token != null){
                    result.addProperty("operation", "login");
                    result.addProperty("token", token);
                    result.addProperty("success", true);
                    result.addProperty("error", false);
                    result.addProperty("errorMessage", "");
                }else response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
            PrintWriter out = response.getWriter();
            out.println(result);
        } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
    }


    public void destroy() {
    }
}