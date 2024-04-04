package com.example.progetto_tweb.Manager;

import java.sql.*;
import java.util.ArrayList;
import java.util.Base64;

public class Director {
    private int id;
    private String name;
    private Date date_birth;
    private String description;
    private String image;

    public Director(int id, String name, String description, Date date_birth, String image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.date_birth = date_birth;
        this.image=image;
    }
    public Director() {

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

    public String getDescription() {
        return description;
    }

    public String getImage() {
        return image;
    }

    @Override
    public String toString() {
        return "Director{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", date_birth=" + date_birth +
                ", desc='" + description + '\'' +
                '}';
    }

    public static void newDirector(Director d, Connection conn) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement("insert into director (name, description, date_birth, image) values (?,?,?,?)")){
            ps.setString(1, d.getName());
            ps.setString(2, d.getDescription());
            ps.setDate(3, d.getDate_birth());
            ps.setBytes(4, Base64.getDecoder().decode(d.getImage()));
            ps.executeUpdate();
        }
        conn.close();
    }
    public static Director loadDirector(int id, Connection conn) throws SQLException {
        Director d = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from director where id = ?")){
            ps.setInt(1, id);
            ResultSet result = ps.executeQuery();
            if (result.next()){
                d = new Director(result.getInt("id"),
                        result.getString("name"),
                        result.getString("description"),
                        result.getDate("date_birth"),
                        Base64.getEncoder().encodeToString(result.getBytes("image")));
            }
        }
        conn.close();
        return d;
    }
    public static String loadImage(int id, Connection conn) throws SQLException {
        String img = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT image from director where id = ?")){
            ps.setInt(1, id);
            ResultSet result = ps.executeQuery();
            if (result.next()){
                img = Base64.getEncoder().encodeToString(result.getBytes("image"));
            }
        }
        conn.close();
        return img;
    }


    public static boolean updateDirector(Director d, Connection conn) throws SQLException{
        boolean res = false;
        try (PreparedStatement ps = conn.prepareStatement("UPDATE director set name = ?, description = ?, date_birth = ?, image = ? where id = ?")){
            ps.setString(1, d.getName());
            ps.setString(2, d.getDescription());
            ps.setDate(3, d.getDate_birth());
            ps.setBytes(4, Base64.getDecoder().decode(d.getImage()));
            ps.setInt(5, d.getId());
            ps.executeUpdate();
            res = true;
        }
        conn.close();
        return res;
    }
    public static boolean deleteDirector(int id, Connection conn) throws SQLException {
        boolean res = false;
        try (PreparedStatement ps = conn.prepareStatement("Delete from director where id = ?")){
            ps.setInt(1, id);;
            ps.executeUpdate();
            res = true;
        }
        conn.close();
        return res;
    }
    public static ArrayList<Integer> getDirectedFilmList(int id, Connection conn) throws SQLException{
        ArrayList<Integer> arr = new ArrayList<Integer>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT distinct film_id from direct where director_id = ?")){
            ps.setInt(1, id);
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(result.getInt("film_id"));
            }
        }
        conn.close();
        return arr;
    }

    public static ArrayList<Director> getAllDirector(Connection conn) throws SQLException{
        ArrayList<Director> arr = new ArrayList<Director>();
        try (PreparedStatement ps = conn.prepareStatement("select id, name, description, date_birth from director")){;
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(new Director(result.getInt("id"),
                        result.getString("name"),
                        result.getString("description"),
                        result.getDate("date_birth"),
                        null));
            }
        }
        conn.close();
        return arr;
    }
    public static boolean deleteDirectorFromMovie(int id, int cod, Connection conn) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement("DELETE from direct where director_id = ? and film_id = ?")){
            ps.setInt(1, id);
            ps.setInt(2, cod);
            ps.executeUpdate();
        }
        return true;
    }

    public static boolean InsertDirectorIntoFilm(int id, int cod, String role, Connection conn) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement("INSERT INTO direct (film_id, director_id, role) VALUES (?, ?, ?)")){
            ps.setInt(1, cod);
            ps.setInt(2, id);
            ps.setString(3, role);
            ps.executeUpdate();
        }
        return true;
    }

}
