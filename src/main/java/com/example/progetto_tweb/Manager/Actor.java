package com.example.progetto_tweb.Manager;

import java.sql.*;
import java.util.ArrayList;
import java.util.Base64;

public class Actor {
    private int id;
    private String name;
    private Date date_birth;
    private String desc;
    private String image;

    public Actor(int id, String name, String desc, Date date_birth, String image) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.date_birth = date_birth;
        this.image=image;
    }
    public Actor() {

    }
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }


    public Date getDate_birth() {
        return date_birth;
    }

    public String getDesc() {
        return desc;
    }

    public String getImage() {
        return image;
    }

    @Override
    public String toString() {
        return "Actor{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", date_birth=" + date_birth +
                ", desc='" + desc + '\'' +
                '}';
    }

    public static int newActor(Actor a, Connection conn) throws SQLException {
        int aId = -1;
        try (PreparedStatement ps = conn.prepareStatement("insert into actors (name, description, date_birth, image) values (?,?,?,?) RETURNING id")){
            ps.setString(1, a.getName());
            ps.setString(2, a.getDesc());
            ps.setDate(3, a.getDate_birth());
            ps.setBytes(4, Base64.getDecoder().decode(a.getImage()));
            ResultSet rs = ps.executeQuery();
            if(rs.next()) aId = rs.getInt(1);
        }
        return aId;
    }
    public static Actor loadActor(int id, Connection conn) throws SQLException {
        Actor actor = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from actors where id = ?")){
            ps.setInt(1, id);
            ResultSet result = ps.executeQuery();
            if (result.next()){
                actor = new Actor(result.getInt("id"),
                        result.getString("name"),
                        result.getString("description"),
                        result.getDate("date_birth"),
                        Base64.getEncoder().encodeToString(result.getBytes("image")));
            }
        }
        
        return actor;
    }
    public static String loadImage(int id, Connection conn) throws SQLException {
        String img = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT image from actors where id = ?")){
            ps.setInt(1, id);
            ResultSet result = ps.executeQuery();
            if (result.next()){
                img = Base64.getEncoder().encodeToString(result.getBytes("image"));
            }
        }
        
        return img;
    }


    public static boolean updateActor(Actor a, Connection conn) throws SQLException{
        boolean res = false;
        try (PreparedStatement ps = conn.prepareStatement("UPDATE actors set name = ?, description = ?, date_birth = ?, image = ? where id = ?")){
            ps.setString(1, a.getName());
            ps.setString(2, a.getDesc());
            ps.setDate(3, a.getDate_birth());
            ps.setBytes(4, Base64.getDecoder().decode(a.getImage()));
            ps.setInt(5, a.getId());
            ps.executeUpdate();
            res = true;
        }
        
        return res;
    }
    public static ArrayList<Integer> getFilmList(int id, Connection conn) throws SQLException{
        ArrayList<Integer> arr = new ArrayList<Integer>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from act where id_actor = ?")){
            ps.setInt(1, id);
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(result.getInt("film_id"));
            }
        }
        
        return arr;
    }

    public static ArrayList<Actor> getAllActor(Connection conn) throws SQLException{

        ArrayList<Actor> arr = new ArrayList<Actor>();
        try (PreparedStatement ps = conn.prepareStatement("select id, name, date_birth, description from actors")){;
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(new Actor(result.getInt("id"),
                        result.getString("name"),
                        result.getString("description"),
                        result.getDate("date_birth"),
                        null));
            }
        }
        
        return arr;
    }

    public static boolean deleteActor(int id, Connection conn) throws SQLException {
        boolean res = true;
        try (PreparedStatement ps = conn.prepareStatement("DELETE from actors where id = ?")){
            ps.setInt(1, id);
            ps.executeUpdate();
        }
        
        return res;
    }

    public static boolean deleteActorFromFilm(int id, int cod, Connection conn) throws SQLException{
        try (PreparedStatement ps = conn.prepareStatement("DELETE from act where id_actor = ? and film_id = ?")){
            ps.setInt(1, id);
            ps.setInt(2, cod);
            ps.executeUpdate();
        }
        return true;
    }
    public static boolean InsertActorIntoFilm(int id, int cod, String character, Connection conn) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement("INSERT INTO act (id_actor, film_id, character) VALUES (?, ?, ?)")){
            ps.setInt(1, id);
            ps.setInt(2, cod);
            ps.setString(3, character);
            ps.executeUpdate();
        }
        return true;
    }
}
