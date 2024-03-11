package com.example.progetto_tweb;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.example.progetto_tweb.login.LoginService;

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
        response.setContentType("application/json");

        Map<String, String[]> pars = request.getParameterMap();

    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        PrintWriter out = response.getWriter();


    }

    public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {

    }

    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {



    }

    public void destroy() {
    }
}