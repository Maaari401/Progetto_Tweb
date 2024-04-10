package com.example.progetto_tweb.login;

import com.example.progetto_tweb.Manager.ManagerDB;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "RPGPC-Login-Servlet", urlPatterns = {LoginService.LOGIN_PATH, LoginService.LOGOUT_PATH})
public class RPGLoginServlet extends HttpServlet {

    public void init() {

    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        // GET accetta sia /login che /logout
        // GET /login restituisce il login status corrente
        // GET /logout effettua il logout e restituisce l'esito
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();


        if (request.getServletPath().equals(LoginService.LOGIN_PATH)) {
            JsonObject result = new JsonObject();
            String username = LoginService.getCurrentLogin(request.getSession());
            result.addProperty("operation", "status");
            result.addProperty("username", username);
            result.addProperty("success", true);
            result.addProperty("error", false);
            result.addProperty("errorMessage", "");
            out.println(result);
        } else if (request.getServletPath().equals(LoginService.LOGOUT_PATH)) {
            JsonObject result = new JsonObject();
            String username = LoginService.getCurrentLogin(request.getSession());
            if (!username.isEmpty()) {
                LoginService.doLogOut(request.getSession(), username);
                result.addProperty("operation", "logout");
                result.addProperty("username", "");
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
        if (request.getServletPath().equals(LoginService.LOGIN_PATH)) {
            response.setContentType("application/json");
            BufferedReader in = request.getReader();
            JsonObject loginObject = JsonParser.parseReader(in).getAsJsonObject();
            String username = loginObject.get("username").getAsString();
            String previous = LoginService.getCurrentLogin(request.getSession());
            JsonObject result = new JsonObject();

            if (!previous.isEmpty() && !previous.equals(username)) {
                result.addProperty("operation", "login");
                result.addProperty("username", previous);
                result.addProperty("success", false);
                result.addProperty("error", true);
                result.addProperty("errorMessage", "Already logged in as a different user.");
            } else {
                String password = loginObject.get("password").getAsString();
                boolean valid = ManagerDB.getManager().validateCredentials(username, password);
                if (valid) {
                    boolean auth = ManagerDB.getManager().checkAuth(username, password);
                    if (previous.isEmpty()) LoginService.doLogIn(request.getSession(), username, auth);
                    result.addProperty("operation", "login");
                    result.addProperty("username", username);
                    result.addProperty("success", true);
                    result.addProperty("error", false);
                    result.addProperty("errorMessage", "");
                } else {
                    result.addProperty("operation", "login");
                    result.addProperty("username", username);
                    result.addProperty("success", false);
                    result.addProperty("error", true);
                    result.addProperty("errorMessage", "Invalid credentials");
                }
            }
            PrintWriter out = response.getWriter();
            out.println(result);
        } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
    }


    public void destroy() {
    }
}