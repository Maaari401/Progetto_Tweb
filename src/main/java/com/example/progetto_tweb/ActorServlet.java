package com.example.progetto_tweb;

import java.io.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.progetto_tweb.Manager.Actor;
import com.example.progetto_tweb.Manager.ManagerDB;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "ActorServlet", urlPatterns = {"/actor", "/actor/*"})
public class ActorServlet extends HttpServlet {
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
                int actorId = Integer.parseInt(pars.get("id")[0]);
                if(actorId > 0){
                    Actor actor = ManagerDB.getManager().getActor(actorId);
                    if(actor != null){
                        out.println(gson.toJson(actor));
                    }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }else{
                List<Actor> actors = ManagerDB.getManager().getAllActor();
                if (!actors.isEmpty()) out.println(gson.toJson(actors));
                else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }
        }else if (request.getPathInfo().equals("/credits")){
            if(pars.containsKey("id")){
                int actor_id = Integer.parseInt(pars.get("id")[0]);
                if(actor_id > 0){
                    List<Integer> l = ManagerDB.getManager().getFilmListOfActor(actor_id);
                    System.out.println(l);
                    if(!l.isEmpty()) out.println(gson.toJson(l));
                    else response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else if (request.getPathInfo().equals("/image")){
            if(pars.containsKey("id")){
                int actor_id = Integer.parseInt(pars.get("id")[0]);
                if(actor_id > 0){
                    Map<String, String> map = new HashMap<>();
                    map.put("image", ManagerDB.getManager().getActorImage(actor_id));
                    out.println(gson.toJson(map));
                }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }else response.sendError(HttpServletResponse.SC_NOT_FOUND);

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if((boolean) request.getSession().getAttribute("auth")) {
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            if (request.getPathInfo() != null) {
                Actor actor = null;
                try {
                    BufferedReader in = request.getReader();
                    actor = gson.fromJson(in, Actor.class);
                } catch (Exception e) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                }
                if (request.getPathInfo().equals("/newActor")) {
                    try {
                        ManagerDB.getManager().setNewActor(actor);
                    } catch (Exception e) {
                        response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
                    }
                } else if (request.getPathInfo().equals("/updateActor")) {
                    try {
                        ManagerDB.getManager().updateActor(actor);
                    } catch (Exception e) {
                        response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e.getMessage());
                    }
                } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            response.setStatus(HttpServletResponse.SC_OK);
            }else response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        if((boolean) request.getSession().getAttribute("auth")) {
            response.setContentType("application/json");
            PrintWriter out = response.getWriter();
            if(request.getPathInfo() != null){
                if(request.getPathInfo().equals("/remove")){
                    Map<String, String[]> pars = request.getParameterMap();
                    if(pars.containsKey("id") && pars.containsKey("cod")){
                        int actor_id = Integer.parseInt(pars.get("id")[0]);
                        int film_cod = Integer.parseInt(pars.get("cod")[0]);
                        if (film_cod > 0 && actor_id > 0) ManagerDB.getManager().deleteActorFromFilm(actor_id, film_cod);
                        else response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                    }else if(pars.containsKey("id")){
                        int actorId = Integer.parseInt(pars.get("id")[0]);
                        if (actorId > 0)  ManagerDB.getManager().deleteActor(actorId);
                        else response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                    } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
                } else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }else response.sendError(HttpServletResponse.SC_NOT_FOUND);
            response.setStatus(HttpServletResponse.SC_OK);
        }else response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if((boolean) req.getSession().getAttribute("auth")) {
            resp.setContentType("application/json");
            PrintWriter out = resp.getWriter();
            if(req.getPathInfo() != null){
                if(req.getPathInfo().equals("/insertAIF")){
                    Map<String, String[]> pars = req.getParameterMap();
                    if(pars.containsKey("id") && pars.containsKey("cod") && pars.containsKey("character")){
                        int actorId = Integer.parseInt(pars.get("id")[0]);
                        int film_cod = Integer.parseInt(pars.get("cod")[0]);
                        String character = pars.get("character")[0];
                        if (actorId > 0 && film_cod > 0 && !character.isBlank())  ManagerDB.getManager().InsertActorIntoFilm(actorId, film_cod, character);
                        else resp.sendError(HttpServletResponse.SC_BAD_REQUEST);
                    }else resp.sendError(HttpServletResponse.SC_NOT_FOUND);
                } else resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            }else resp.sendError(HttpServletResponse.SC_NOT_FOUND);
            resp.setStatus(HttpServletResponse.SC_OK);
        }else resp.sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    public void destroy() {
    }
}
