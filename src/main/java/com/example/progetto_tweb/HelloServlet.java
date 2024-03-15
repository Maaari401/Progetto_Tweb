package com.example.progetto_tweb;

import java.io.*;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.example.progetto_tweb.Manager.Actor;
import com.example.progetto_tweb.Manager.Film;
import com.example.progetto_tweb.Manager.ManagerDB;
import com.example.progetto_tweb.db.PoolingPersistenceManager;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "helloServlet", value = "/hello-servlet")
public class HelloServlet extends HttpServlet {
    private String message;
    private ManagerDB manager;
    public void init() {
        manager = ManagerDB.getManager();
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Retrieve actors with image data from the database
        List<Actor> actors = ManagerDB.getManager().getAllActor();

        // Construct HTML response containing actor details and embedded images
        StringBuilder htmlBuilder = new StringBuilder();
        htmlBuilder.append("<html><head><title>Actors</title></head><body>");

        for (Actor actor : actors) {
            htmlBuilder.append("<div>");
            htmlBuilder.append("<h2>").append(actor.getName()).append("</h2>");
            // Embed image directly in HTML using Base64 encoding
            htmlBuilder.append("<img src=\"data:image/jpeg;base64,");
            htmlBuilder.append(encodeImageAsBase64(actor.getImage()));
            htmlBuilder.append("\"/><br/>");
            htmlBuilder.append("</div>");
        }

        htmlBuilder.append("</body></html>");

        // Set content type and write HTML response to the servlet response
        response.setContentType("text/html");
        response.getWriter().write(htmlBuilder.toString());
    }

    private String encodeImageAsBase64(byte[] imageData) {
        // Use Base64 encoding to embed image data directly in HTML
        return java.util.Base64.getEncoder().encodeToString(imageData);
    }


    public void destroy() {

    }
}