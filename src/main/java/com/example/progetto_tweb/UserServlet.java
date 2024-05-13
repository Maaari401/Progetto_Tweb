package com.example.progetto_tweb;

import java.io.*;
import java.sql.Date;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

import com.example.progetto_tweb.Manager.Film;
import com.example.progetto_tweb.Manager.ManagerDB;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import com.example.progetto_tweb.token.*;

@WebServlet(name = "UserServlet", urlPatterns = {"/user", "/user/*"})
public class UserServlet extends HttpServlet {
    private Gson gson;
    public void init() {
        gson = new GsonBuilder().setDateFormat("dd-MM-yyyy").create();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Map<String, String[]> pars = request.getParameterMap();

        if(request.getPathInfo() != null){
            if(request.getPathInfo().equals("/watched") && pars.containsKey("film_id") && pars.containsKey("user_id")) {
                out.println(gson.toJson(ManagerDB.getManager().checkWatchValues(
                        Integer.parseInt(pars.get("user_id")[0]),
                        Integer.parseInt(pars.get("film_id")[0])
                )));
            }else if(request.getPathInfo().equals("/filmWatched") && pars.containsKey("user_id")) {
                out.println(gson.toJson(ManagerDB.getManager().filmWatched(Integer.parseInt(pars.get("user_id")[0]))));
            }else if(request.getPathInfo().equals("/filmLiked") && pars.containsKey("user_id")) {
                out.println(gson.toJson(ManagerDB.getManager().filmLiked(Integer.parseInt(pars.get("user_id")[0]))));
            }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);

    }
    public void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Map<String, String[]> pars = request.getParameterMap();

        if(request.getPathInfo() != null){
            if(request.getPathInfo().equals("/watched") && pars.containsKey("film_id") && pars.containsKey("user_id")){
                int film_id = Integer.parseInt(pars.get("film_id")[0]);
                int user_id = Integer.parseInt(pars.get("user_id")[0]);
                if(film_id > 0 && user_id > 0){
                    ManagerDB.getManager().setWatched(user_id, film_id);
                    response.setStatus(HttpServletResponse.SC_OK);
                } else response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            }else if(request.getPathInfo().equals("/like") && pars.containsKey("film_id") && pars.containsKey("user_id") && pars.containsKey("like")){
                int film_id = Integer.parseInt(pars.get("film_id")[0]);
                int user_id = Integer.parseInt(pars.get("user_id")[0]);
                boolean liked = Boolean.parseBoolean(pars.get("like")[0]);
                if(film_id > 0 && user_id > 0){
                    ManagerDB.getManager().setLiked(user_id, film_id, liked);
                    response.setStatus(HttpServletResponse.SC_OK);
                }else response.sendError(HttpServletResponse.SC_BAD_REQUEST);

            }else if(request.getPathInfo().equals("/remWatched") && pars.containsKey("film_id") && pars.containsKey("user_id")){
                int film_id = Integer.parseInt(pars.get("film_id")[0]);
                int user_id = Integer.parseInt(pars.get("user_id")[0]);
                if(film_id > 0 && user_id > 0){
                    ManagerDB.getManager().remWatched(user_id, film_id);
                    response.setStatus(HttpServletResponse.SC_OK);
                } else response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            }else response.sendError(HttpServletResponse.SC_NOT_FOUND);

        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);

    }



    public void destroy() {
    }
}