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
    private final ArrayList<Integer> actors = new ArrayList<>();

    public Film(int cod, String name, double ranking, Date publicRelease) {
        this.cod = cod;
        this.name = name;
        this.ranking = ranking;
        this.publicRelease = publicRelease;
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

    public ArrayList<Integer> getActors() {
        return actors;
    }

    @Override
    public String toString() {
        return "Film{" +
                "cod=" + cod +
                ", name='" + name + '\'' +
                ", ranking=" + ranking +
                ", publicRelease=" + publicRelease +
                ", actors=" + actors +
                '}';
    }
    public Film loadFilm(int cod, Connection conn) throws SQLException {
        Film film = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from film where cod = ?")){
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            if (result.next()){
                film = new Film(result.getInt("cod"),
                        result.getString("name"),
                        result.getDouble("ranking"),
                        result.getDate("public_release"));
            }
        }
        return film;
    }

    public void updateFilm(Film f, Connection conn) throws SQLException{
        try (PreparedStatement ps = conn.prepareStatement("UPDATE film set cod = ?, name = ?, raning = ?, public_release = ? where cod = ?")){
            ps.setInt(1, f.getCod());
            ps.setString(2, f.getName());
            ps.setDouble(3, f.getRanking());
            ps.setDate(4, f.getPublicRelease());
            ps.setInt(5, f.getCod());
            ResultSet result = ps.executeQuery();

            System.out.println(result);
            if (result.next()){

            }
        }
    }
    public ArrayList<Integer> getActorList(int cod, Connection conn) throws SQLException{
        ArrayList<Integer> arr = new ArrayList<Integer>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from act where film_id = ?")){
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(result.getInt("id_actor"));
            }
        }
        return arr;
    }
}
