package com.example.progetto_tweb;

import java.io.*;
import java.util.ArrayList;
import java.util.Map;

import com.example.progetto_tweb.Manager.Film;
import com.example.progetto_tweb.Manager.ManagerDB;
import com.google.gson.Gson;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "FilmServlet", urlPatterns = {"/film", "/film/*"})
public class FilmServlet extends HttpServlet {
    private Gson gson;
    public void init() {
        gson = new Gson();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Map<String, String[]> pars = request.getParameterMap();

        System.out.println(request.getPathInfo());

        if(request.getPathInfo() == null){

            if(pars.containsKey("id")){
                int film_id = Integer.parseInt(pars.get("id")[0]);
                if(film_id > 0){
                    Film f = ManagerDB.getManager().getFilm(film_id);
                    if(f != null) out.println(gson.toJson(f));
                    else response.sendError(HttpServletResponse.SC_NOT_FOUND);
                } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }else{
                ArrayList<Film> arr = ManagerDB.getManager().getAllFilm();
                if(!arr.isEmpty()) out.println(gson.toJson(arr));
                else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }
        }else if (request.getPathInfo().equals("/credits")){
            if(pars.containsKey("id")){
                int film_id = Integer.parseInt(pars.get("id")[0]);
                if(film_id > 0){
                    Map<String, ArrayList<Integer>> map = ManagerDB.getManager().getCredits(film_id);
                    if(!map.isEmpty()) out.println(gson.toJson(map));
                    else response.sendError(HttpServletResponse.SC_NOT_FOUND);
                } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        /*
        */
    }
    public void destroy() {
    }
}