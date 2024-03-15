package com.example.progetto_tweb.Manager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;

public class Film {
    private int cod;
    private String name;
    private double ranking;
    private Date publicRelease;
    private byte[] cover;
    private String desc;
    private final ArrayList<Integer> actors = new ArrayList<>();
    private final ArrayList<Integer> directors = new ArrayList<>();

    public Film(int cod, String name, double ranking, Date publicRelease, String desc, byte[] image) {
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

    public byte[] getCover() {
        return cover;
    }

    public String getDesc() {
        return desc;
    }

    public ArrayList<Integer> getActors() {
        return actors;
    }

    public ArrayList<Integer> getDirectors() {
        return directors;
    }

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
            ps.setBytes(5, f.getCover());
            ps.executeQuery();
        }
        conn.close();
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
                        result.getBytes("cover")
                );
            }
        }
        conn.close();
        return film;
    }

    public static boolean updateFilm(Film f, Connection conn) throws SQLException{
        boolean res = false;
        try (PreparedStatement ps = conn.prepareStatement("UPDATE film set cod = ?, name = ?, raning = ?, public_release = ?, description = ?, cover = ? where cod = ?")){
            ps.setInt(1, f.getCod());
            ps.setString(2, f.getName());
            ps.setDouble(3, f.getRanking());
            ps.setDate(4, f.getPublicRelease());
            ps.setString(5, f.getDesc());
            ps.setBytes(6, f.getCover());
            ps.setInt(7, f.getCod());
            ResultSet result = ps.executeQuery();

            System.out.println(result.getStatement());
            if (result.next()){
                res = true;
            }
        }
        conn.close();
        return res;
    }
    public static ArrayList<Integer> getActorList(int cod, Connection conn) throws SQLException{
        ArrayList<Integer> arr = new ArrayList<Integer>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT id_actor from act where film_id = ?")){
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(result.getInt("id_actor"));
            }
        }
        conn.close();
        return arr;
    }
    public static ArrayList<Integer> getDirectorList(int cod, Connection conn) throws SQLException {
        ArrayList<Integer> arr = new ArrayList<Integer>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT director_id from direct where film_id = ?")) {
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            while (result.next()) {
                arr.add(result.getInt("director_id"));
            }
            conn.close();
            return arr;
        }
    }

    public static ArrayList<Film> getAllFilm(Connection conn) throws SQLException{
        ArrayList<Film> arr = new ArrayList<Film>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from film")){
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(new Film(result.getInt("cod"),
                                result.getString("name"),
                                result.getDouble("ranking"),
                                result.getDate("public_release"),
                                result.getString("description"),
                                result.getBytes("cover")
                        )
                );
            }
        }
        conn.close();
        return arr;
    }
}
