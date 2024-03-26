package com.example.progetto_tweb;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.progetto_tweb.Manager.Director;
import com.example.progetto_tweb.Manager.ManagerDB;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "DirectorServlet", urlPatterns = {"/director", "/director/*"})
public class DirectorServlet extends HttpServlet {
    private Gson gson;

    public void init() {
        gson = new GsonBuilder().setDateFormat("dd-MM-yyyy").create();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Map<String, String[]> pars = request.getParameterMap();
        if(request.getPathInfo() == null){
            if(pars.containsKey("id")){
                int directorId = Integer.parseInt(pars.get("id")[0]);
                if(directorId > 0){
                    Director director = ManagerDB.getManager().getDirector(directorId);
                    if(director != null){
                        out.println(gson.toJson(director));
                    }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }else{
                List<Director> directors = ManagerDB.getManager().getAllDirectors();
                if (!directors.isEmpty()) out.println(gson.toJson(directors));
                else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }
        }else if (request.getPathInfo().equals("/movies")){
            if(pars.containsKey("id")){
                int directorId = Integer.parseInt(pars.get("id")[0]);
                if(directorId > 0){
                    List<Integer> movieList = ManagerDB.getManager().getDirectedFilmList(directorId);
                    if(!movieList.isEmpty()) out.println(gson.toJson(movieList));
                    else response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else if (request.getPathInfo().equals("/image")){
            if(pars.containsKey("id")){
                int directorId = Integer.parseInt(pars.get("id")[0]);
                if(directorId > 0){
                    Map<String, String> map = new HashMap<>();
                    map.put("image", ManagerDB.getManager().getDirectorImage(directorId));
                    out.println(gson.toJson(map));
                }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        if(request.getPathInfo() != null){
            Director director = null;
            try{
                BufferedReader in = request.getReader();
                director = gson.fromJson(in, Director.class);
            }catch(Exception e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            }
            if(request.getPathInfo().equals("/newDirector")) {
                try{
                    ManagerDB.getManager().setNewDirector(director);
                }catch(Exception e) {
                    response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
                }
            }else if(request.getPathInfo().equals("/updateDirector")){
                try{
                    ManagerDB.getManager().updateDirector(director);
                }catch(Exception e) {
                    response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
                }
            }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        if(request.getPathInfo() != null){
            if(request.getPathInfo().equals("/remove")){
                Map<String, String[]> pars = request.getParameterMap();
                if(pars.containsKey("id") && pars.containsKey("cod")){
                    int directorId = Integer.parseInt(pars.get("id")[0]);
                    int film_cod = Integer.parseInt(pars.get("cod")[0]);
                    if (directorId > 0 && film_cod > 0) ManagerDB.getManager().deleteDirectorFromFilm(directorId, film_cod);
                    else response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                } else if(pars.containsKey("id")){
                    int directorId = Integer.parseInt(pars.get("id")[0]);
                    if (directorId > 0) ManagerDB.getManager().deleteDirector(directorId);
                    else response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");
        PrintWriter out = resp.getWriter();
        if(req.getPathInfo() != null){
            if(req.getPathInfo().equals("/insertDIF")){
                Map<String, String[]> pars = req.getParameterMap();
                if(pars.containsKey("id") && pars.containsKey("cod") && pars.containsKey("role")){
                    int directorId = Integer.parseInt(pars.get("id")[0]);
                    int movieCode = Integer.parseInt(pars.get("cod")[0]);
                    String role = pars.get("role")[0];
                    if (directorId > 0 && movieCode > 0)  ManagerDB.getManager().insertMovieForDirector(directorId, movieCode, role);
                    else resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
                }else resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    public void destroy() {
    }
}
