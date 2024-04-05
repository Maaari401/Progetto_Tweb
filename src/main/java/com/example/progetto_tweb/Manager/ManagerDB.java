package com.example.progetto_tweb.Manager;

import com.example.progetto_tweb.db.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

    public String getActorImage(int id){
        String res = null;
        try{
            res = Actor.loadImage(id, persistence.getConnection());
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

    public void setNewFilm(Film f) throws SQLException {
        try{

            Film.newFilm(f, persistence.getConnection());
            //return true;
        }catch (SQLException e){
            throw e;
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
    public String getFilmCover(int cod){
        try{
            return Film.loadImage(cod, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
            return null;
        }
    }

    public List<String[]> getActorOfFilm(int cod){
        try{
            return Film.getActorList(cod, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
            return null;
        }
    }
    public Map<String, List<String[]>> getCrewOfFilm(int cod) {
        try {
            return Film.getDirectorList(cod, persistence.getConnection());
        } catch (SQLException e) {
            System.out.println(e);
            return null;
        }
    }


    public boolean updateFilm(Film f) throws SQLException {
        boolean res = false;
        try{
            res = Film.updateFilm(f, persistence.getConnection());
        }catch (SQLException e){
            throw e;
        }
        return res;
    }
    public List<String[]> getActorsOfFilm(int cod){
        List<String[]> res = new ArrayList<>();
        try {
            res = Film.getActorList(cod, persistence.getConnection());
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

    public boolean deleteActor(int id){
        try {
            return Actor.deleteActor(id, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return false;
    }

    public boolean deleteFilm(int cod){
        try {
            return Film.deleteFilm(cod, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public boolean deleteActorFromFilm(int id, int cod){
        try {
            return Actor.deleteActorFromFilm(id, cod, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public boolean InsertActorIntoFilm(int id, int cod, String character){
        try {
            return Actor.InsertActorIntoFilm(id, cod, character, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public String getDirectorImage(int directorId) {
        String res = null;
        try{
            res = Director.loadImage(directorId, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public boolean deleteDirector(int id){
        try {
            return Director.deleteDirector(id, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public boolean insertMovieForDirector(int directorId, int movieCode, String role) {
        try {
            return Director.InsertDirectorIntoFilm(directorId, movieCode, role, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public boolean deleteDirectorFromFilm(int id, int cod){
        try {
            return Director.deleteDirectorFromMovie(id, cod, persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }
}
