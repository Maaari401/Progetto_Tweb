package com.example.progetto_tweb.Manager;

import com.example.progetto_tweb.db.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class ManagerDB {
    private static ManagerDB manager;
    private final PoolingPersistenceManager persistence;

    public ManagerDB() {
        persistence = PoolingPersistenceManager.getPersistenceManager();
    }

    public static ManagerDB getManager() {
        if (manager == null) {
            manager = new ManagerDB();
        }
        return manager;
    }


    public Actor getActor(int id){
        Actor res = null;
        try{
            res = Actor.loadActor(id, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public boolean setNewActor(Actor a){
        try{
            Actor.newActor(a, persistence.getConnection());
            return true;
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }
    public boolean updateActor(Actor a){
        boolean res = false;
        try{
            res = Actor.updateActor(a, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }

    public ArrayList<Actor> getAllActor(){
        ArrayList<Actor> arr = new ArrayList<>();
        try {
          arr = Actor.getAllActor(persistence.getConnection());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return arr;
    }
    public ArrayList<Integer> getFilmListOfActor(int id){
        ArrayList<Integer> arr = new ArrayList<Integer>();
        try{
            arr = Actor.getFilmList(id, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return arr;
    }

    public void setNewFilm(Film f){
        try{
            Film.newFilm(f, persistence.getConnection());
            //return true;
        }catch (SQLException e){
            System.out.println(e);
            //return false;
        }
    }
    public Film getFilm(int cod){
        Film res = null;
        try{
            res = Film.loadFilm(cod, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public Map<String, ArrayList<Integer>> getCredits(int cod){
        Map<String, ArrayList<Integer>> res = new HashMap<>();
        try{
            res.put("actors", Film.getActorList(cod, persistence.getConnection()));
            res.put("directors", Film.getDirectorList(cod, persistence.getConnection()));
        }catch (SQLException e){
            System.out.println(e);
            res = null;
        }
        return res;
    }


    public boolean updateFilm(Film f){
        boolean res = false;
        try{
            res = Film.updateFilm(f, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public ArrayList<Integer> getActorsOfFilm(int cod){
        ArrayList<Integer> res = new ArrayList<>();
        try {
            res = Film.getActorList(cod, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public ArrayList<Integer> getDirectorsOfFilm(int cod){
        ArrayList<Integer> res = new ArrayList<>();
        try {
            res = Film.getDirectorList(cod, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public ArrayList<Film> getAllFilm(){
        ArrayList<Film> res = new ArrayList<>();
        try {
            res = Film.getAllFilm(persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }


    public void setNewDirector(Director d){
        try{
            Director.newDirector(d, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
    }
    public Director getDirector(int id){
        Director res = null;
        try{
            res = Director.loadDirector(id, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }

    public boolean updateDirector(Director d){
        boolean res = false;
        try{
            res = Director.updateDirector(d, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public ArrayList<Integer> getDirectedFilmList(int id){
        ArrayList<Integer> res = new ArrayList<>();
        try {
            res = Director.getDirectedFilmList(id, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public ArrayList<Director> getAllDirectors(){
        ArrayList<Director> res = new ArrayList<>();
        try {
            res = Director.getAllDirector(persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }


}
