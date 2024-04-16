package com.example.progetto_tweb.Manager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Date;
import java.util.*;
import java.util.stream.Collectors;

public class Film {
    private int cod;
    private String name;
    private double ranking;
    private Date publicRelease;
    private String cover;
    private String desc;
    //private ArrayList<Integer> actors = new ArrayList<>();



    //private ArrayList<Integer> directors = new ArrayList<>();

    public Film(int cod, String name, double ranking, Date publicRelease, String desc, String image) {
        this.cod = cod;
        this.name = name;
        this.ranking = ranking;
        this.publicRelease = publicRelease;
        this.desc = desc;
        this.cover = image;
    }
    public Film(){

    }

    public int getCod() {
        return cod;
    }

    public String getName() {
        return name;
    }

    public double getRanking() {
        return ranking;
    }

    public Date getPublicRelease() {
        return publicRelease;
    }

    public String getCover() {
        return cover;
    }

    public String getDesc() {
        return desc;
    }

    /*public ArrayList<Integer> getActors() {
        return actors;
    }

    public ArrayList<Integer> getDirectors() {
        return directors;
    }

    public void setActors(ArrayList<Integer> actors) {
        this.actors = actors;
    }

    public void setDirectors(ArrayList<Integer> directors) {
        this.directors = directors;
    }*/

    /*
    @Override
    public String toString() {
        return "Film{" +
                "cod=" + cod +
                ", name='" + name + '\'' +
                ", ranking=" + ranking +
                ", publicRelease=" + publicRelease +
                ", desc='" + desc + '\'' +
                '}';
    }*/
    @Override
    public String toString() {
        return "Film{cod=" + cod +"}";
    }

    public static void newFilm(Film f, Connection conn) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement("insert into film (name, ranking, public_release, description, cover) values (?,?,?,?,?)")){
            ps.setString(1, f.getName());
            ps.setDouble(2, f.getRanking());
            ps.setDate(3, f.getPublicRelease());
            ps.setString(4, f.getDesc());
            ps.setBytes(5, Base64.getDecoder().decode(f.getCover()));
            ps.executeUpdate();
        }
        
    }

    public static Film loadFilm(int cod, Connection conn) throws SQLException {
        Film film = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from film f where cod = ?")){
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            if (result.next()){
                film = new Film(result.getInt("cod"),
                        result.getString("name"),
                        result.getDouble("ranking"),
                        result.getDate("public_release"),
                        result.getString("description"),
                        Base64.getEncoder().encodeToString(result.getBytes("cover"))
                );
            }
        }
        
        return film;
    }

    public static String loadImage(int cod, Connection conn) throws SQLException {
        String img = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT cover from film where cod = ?")){
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            if (result.next()){
                img = Base64.getEncoder().encodeToString(result.getBytes("cover"));
            }
        }
        return img;
    }

    public static boolean updateFilm(Film f, Connection conn) throws SQLException{
        boolean res = true;
        try (PreparedStatement ps = conn.prepareStatement("UPDATE film set name = ?, ranking = ?, public_release = ?, description = ?, cover = ? where cod = ?")){
            ps.setString(1, f.getName());
            ps.setDouble(2, f.getRanking());
            ps.setDate(3, f.getPublicRelease());
            ps.setString(4, f.getDesc());
            ps.setBytes(5, Base64.getDecoder().decode(f.getCover()));
            ps.setInt(6, f.getCod());
            ps.executeUpdate();        }
        
        return res;
    }
    public static List<String[]> getActorList(int cod, Connection conn) throws SQLException{
        List<String[]> l = new ArrayList<>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT *  from act where film_id = ? order by order_cast ASC")){
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            while (result.next()){
                String[] tmp = {""+result.getInt("id_actor"), result.getString("character")};
                l.add(tmp);
            }
        }
        
        return l.isEmpty()? null : l;
    }
    public static Map<String, List<String[]>> getDirectorList(int cod, Connection conn) throws SQLException {
        List<String[]> l = new ArrayList<String[]>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from direct where film_id = ?")) {
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            while (result.next()) {
                String[] tmp = {""+result.getInt("director_id"), result.getString("role"), result.getString("departmant")};
                l.add(tmp);
            }

            Map<String, List<String[]>> groupedDirectors = new HashMap<>();
            for (String[] var: l){
                String department = var[2]; // Assuming department is at index 2 in the array
                if (!groupedDirectors.containsKey(department)) {
                    groupedDirectors.put(department, new ArrayList<>());
                }
                groupedDirectors.get(department).add(var);
            }

            
            return groupedDirectors.isEmpty() ? null : groupedDirectors;
        }
    }

    public static ArrayList<Film> getAllFilm(Connection conn) throws SQLException{
        ArrayList<Film> arr = new ArrayList<Film>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT cod, name, ranking, public_release, description from film")){
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(new Film(result.getInt("cod"),
                                result.getString("name"),
                                result.getDouble("ranking"),
                                result.getDate("public_release"),
                                result.getString("description"),
                                null)
                );
            }
        }
        return arr;
    }

    public static boolean deleteFilm(int cod, Connection conn) throws SQLException {
        boolean res = true;
        try (PreparedStatement ps = conn.prepareStatement("DELETE from film where cod = ?")){
            ps.setInt(1, cod);
            ps.executeUpdate();
        }
        
        return res;
    }
}
