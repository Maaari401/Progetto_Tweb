package com.example.progetto_tweb;

import java.io.*;
import java.sql.Connection;
import java.sql.SQLException;

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
    public PoolingPersistenceManager persistence;
    public void init() {
        persistence = PoolingPersistenceManager.getPersistenceManager();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");

        try {
            Actor a = new Actor();
            a = a.loadActor(1, persistence.getConnection());
            System.out.println(a.toString());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void destroy() {
    }
}