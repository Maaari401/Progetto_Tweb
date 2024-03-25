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
            if(pars.containsKey("cod")){
                int film_id = Integer.parseInt(pars.get("cod")[0]);
                if(film_id > 0){
                    Map<String, List<String[]>> map = ManagerDB.getManager().getCredits(film_id);
                    System.out.println(map);
                    if(map != null) out.println(gson.toJson(map));
                    else response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }if (request.getPathInfo().equals("/cover")){
            if(pars.containsKey("cod")){
                int film_cod = Integer.parseInt(pars.get("cod")[0]);
                if(film_cod > 0){
                    Map<String, String> map = new HashMap<>();
                    map.put("image", ManagerDB.getManager().getFilmCover(film_cod));
                    out.println(gson.toJson(map));
                }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        if(request.getPathInfo() != null){
            Film f = null;
            try{
                BufferedReader in = request.getReader();
                f = gson.fromJson(in, Film.class);
            }catch (Exception e){
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            }
            if(request.getPathInfo().equals("/newFilm")){
                try{
                    ManagerDB.getManager().setNewFilm(f);
                }catch (SQLException e){
                    response.sendError(460, "Film già presente nel nostro database");
                }
            }else if(request.getPathInfo().equals("/updateFilm")){
                try{
                    ManagerDB.getManager().updateFilm(f);
                }catch (SQLException e){
                    response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }
            }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        if(request.getPathInfo() != null) {
            if (request.getPathInfo().equals("/remove")) {
                Map<String, String[]> pars = request.getParameterMap();
                if (pars.containsKey("id")) {
                    int film_id = Integer.parseInt(pars.get("id")[0]);
                    if(film_id > 0) {
                        ManagerDB.getManager().deleteFilm(film_id);
                    }else response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
        response.setStatus(HttpServletResponse.SC_OK);
    }

    public void destroy() {
    }
}