package com.example.progetto_tweb.singup;

import com.example.progetto_tweb.Manager.Actor;
import com.example.progetto_tweb.Manager.ManagerDB;
import com.example.progetto_tweb.Manager.User;
import com.example.progetto_tweb.token.tokenManager;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "SingUpServlet", urlPatterns = {"/singup"})
public class SingUpServlet extends HttpServlet {
    private Gson gson;

    public void init() {
        gson = new GsonBuilder().setDateFormat("dd-MM-yyyy").create();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
            User user = null;
            try {
                BufferedReader in = request.getReader();
                user = gson.fromJson(in, User.class);
            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            }
            try {
                ManagerDB.getManager().setNewUser(user);
            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
            }
    }

    @Override
    public void destroy() {
    }


}
