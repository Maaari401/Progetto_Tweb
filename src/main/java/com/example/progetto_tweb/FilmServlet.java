package com.example.progetto_tweb;

import java.io.*;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import com.example.progetto_tweb.Manager.Film;
import com.example.progetto_tweb.Manager.ManagerDB;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "FilmServlet", urlPatterns = {"/film", "/film/*"})
public class FilmServlet extends HttpServlet {
    private Gson gson;
    public void init() {
        gson = new GsonBuilder().setDateFormat("dd-MM-yyyy").create();
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
                    Map<String, List<String[]>> map = ManagerDB.getManager().getCredits(film_id);
                    System.out.println(map);
                    if(map != null) out.println(gson.toJson(map));
                    else response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        if(request.getPathInfo() != null){
            if(request.getPathInfo().equals("/newFilm")){
                Film f = null;
                try{
                    BufferedReader in = request.getReader();
                    f = gson.fromJson(in, Film.class);
                    ManagerDB.getManager().setNewFilm(f);
                }catch (Exception e){
                    response.sendError(460, "Film già presente nel nostro database");
                }
            }else if(request.getServletPath().equals("/updateFilm")){
                System.out.println("update");
            }
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);

    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    public void destroy() {
    }
}