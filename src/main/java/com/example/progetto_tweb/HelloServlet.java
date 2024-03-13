package com.example.progetto_tweb;

import java.io.*;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.util.ArrayList;

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

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");

        System.out.println(manager.getAllFilm());
    }

    public void destroy() {

    }
}