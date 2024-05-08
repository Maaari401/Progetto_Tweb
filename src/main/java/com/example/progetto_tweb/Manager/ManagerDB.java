package com.example.progetto_tweb.Manager;

import com.example.progetto_tweb.db.*;

import java.sql.Connection;
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
        try(Connection conn = persistence.getConnection()){
            res = Actor.loadActor(id, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }

    public String getActorImage(int id){
        String res = null;
        try(Connection conn = persistence.getConnection()){
            res = Actor.loadImage(id, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }

    public boolean setNewActor(Actor a){
        try(Connection conn = persistence.getConnection()){
            Actor.newActor(a, conn);
            return true;
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public boolean updateActor(Actor a){
        boolean res = false;
        try(Connection conn = persistence.getConnection()){
            res = Actor.updateActor(a, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }

    public ArrayList<Actor> getAllActor(){
        ArrayList<Actor> arr = new ArrayList<>();
        try(Connection conn = persistence.getConnection()) {
          arr = Actor.getAllActor(persistence.getConnection());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return arr;
    }
    public ArrayList<Integer> getFilmListOfActor(int id){
        ArrayList<Integer> arr = new ArrayList<Integer>();
        try(Connection conn = persistence.getConnection()){
            arr = Actor.getFilmList(id, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return arr;
    }

    public void setNewFilm(Film f) throws SQLException {
        try(Connection conn = persistence.getConnection()){

            Film.newFilm(f, conn);
            //return true;
        }catch (SQLException e){
            throw e;
            //return false;
        }
    }
    public Film getFilm(int cod){
        Film res = null;
        try(Connection conn = persistence.getConnection()){
            res = Film.loadFilm(cod, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public String getFilmCover(int cod){
        try(Connection conn = persistence.getConnection()){
            return Film.loadImage(cod, conn);
        }catch (SQLException e){
            System.out.println(e);
            return null;
        }
    }

    public List<String[]> getActorOfFilm(int cod){
        try(Connection conn = persistence.getConnection()){
            return Film.getActorList(cod, conn);
        }catch (SQLException e){
            System.out.println(e);
            return null;
        }
    }
    public Map<String, List<String[]>> getCrewOfFilm(int cod) {
        try(Connection conn = persistence.getConnection()) {
            return Film.getDirectorList(cod, conn);
        } catch (SQLException e) {
            System.out.println(e);
            return null;
        }
    }


    public boolean updateFilm(Film f) throws SQLException {
        boolean res = false;
        try(Connection conn = persistence.getConnection()){
            res = Film.updateFilm(f, conn);
        }catch (SQLException e){
            throw e;
        }
        return res;
    }
    public List<String[]> getActorsOfFilm(int cod){
        List<String[]> res = new ArrayList<>();
        try(Connection conn = persistence.getConnection()) {
            res = Film.getActorList(cod, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }

    public ArrayList<Film> getAllFilm(){
        ArrayList<Film> res = new ArrayList<>();
        try(Connection conn = persistence.getConnection()) {
            res = Film.getAllFilm(persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }


    public void setNewDirector(Director d){
        try(Connection conn = persistence.getConnection()){
            Director.newDirector(d, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
    }
    public Director getDirector(int id){
        Director res = null;
        try(Connection conn = persistence.getConnection()){
            res = Director.loadDirector(id, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }

    public boolean updateDirector(Director d){
        boolean res = false;
        try(Connection conn = persistence.getConnection()){
            res = Director.updateDirector(d, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public ArrayList<Integer> getDirectedFilmList(int id){
        ArrayList<Integer> res = new ArrayList<>();
        try(Connection conn = persistence.getConnection()) {
            res = Director.getDirectedFilmList(id, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public ArrayList<Director> getAllDirectors(){
        ArrayList<Director> res = new ArrayList<>();
        try(Connection conn = persistence.getConnection()) {
            res = Director.getAllDirector(persistence.getConnection());
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }

    public boolean deleteActor(int id){
        try(Connection conn = persistence.getConnection()) {
            return Actor.deleteActor(id, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return false;
    }

    public boolean deleteFilm(int cod){
        try(Connection conn = persistence.getConnection()) {
            return Film.deleteFilm(cod, conn);
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public boolean deleteActorFromFilm(int id, int cod){
        try(Connection conn = persistence.getConnection()) {
            return Actor.deleteActorFromFilm(id, cod, conn);
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public boolean InsertActorIntoFilm(int id, int cod, String character){
        try(Connection conn = persistence.getConnection()) {
            return Actor.InsertActorIntoFilm(id, cod, character, conn);
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public String getDirectorImage(int directorId) {
        String res = null;
        try(Connection conn = persistence.getConnection()){
            res = Director.loadImage(directorId, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
        return res;
    }
    public boolean deleteDirector(int id){
        try(Connection conn = persistence.getConnection()) {
            return Director.deleteDirector(id, conn);
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public boolean insertMovieForDirector(int directorId, int movieCode, String role) {
        try(Connection conn = persistence.getConnection()) {
            return Director.InsertDirectorIntoFilm(directorId, movieCode, role, conn);
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public boolean deleteDirectorFromFilm(int id, int cod){
        try(Connection conn = persistence.getConnection()) {
            return Director.deleteDirectorFromMovie(id, cod, conn);
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public int validateCredentials(String username, String password) {
        try(Connection conn = persistence.getConnection()) {
            return User.validateCredentials(username, password, conn);
        }catch (SQLException e){
            System.out.println(e);
            return -1;
        }
    }
    public boolean checkAuth(String username, String password) {
        try(Connection conn = persistence.getConnection()) {
            return User.checkAuth(username, password, conn);
        }catch (SQLException e){
            System.out.println(e);
            return false;
        }
    }

    public void setNewUser(User user) {
        try(Connection conn = persistence.getConnection()){
            User.newUser(user, conn);
        }catch (SQLException e){
            System.out.println(e);
        }
    }

}
