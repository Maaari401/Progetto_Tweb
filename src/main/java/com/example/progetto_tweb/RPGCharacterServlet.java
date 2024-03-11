package com.example.progetto_tweb;

import java.io.*;
import java.util.ArrayList;
import java.util.Map;

import com.google.gson.Gson;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "RPGPC-Character-Servlet", urlPatterns = {"/characters"})
public class RPGCharacterServlet extends HttpServlet {

    private Gson gson;

    public void init() {
        gson = new Gson();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        Map<String, String[]> pars = request.getParameterMap();
    }
    public void destroy() {
    }
}