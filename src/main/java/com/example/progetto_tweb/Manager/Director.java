package com.example.progetto_tweb.Manager;

import java.sql.*;
import java.util.ArrayList;

public class Director {
    private int id;
    private String name;
    private Date date_birth;
    private String desc;
    private byte[] image;

    public Director(int id, String name, String desc, Date date_birth, byte[] image) {
        this.id = id;
        this.name = name;
        this.desc = desc;
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

    public String getDesc() {
        return desc;
    }

    public byte[] getImage() {
        return image;
    }

    @Override
    public String toString() {
        return "Director{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", date_birth=" + date_birth +
                ", desc='" + desc + '\'' +
                '}';
    }

    public static void newDirector(Director d, Connection conn) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement("insert into director (name, description, date_birth, image) values (?,?,?,?)")){
            ps.setString(1, d.getName());
            ps.setString(2, d.getDesc());
            ps.setDate(3, d.getDate_birth());
            ps.setBytes(4, d.getImage());
            ps.executeQuery();
        }
        conn.close();
    }
    public static Director loadDirector(int id, Connection conn) throws SQLException {
        Director d = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from actors where id = ?")){
            ps.setInt(1, id);
            ResultSet result = ps.executeQuery();
            if (result.next()){
                d = new Director(result.getInt("id"),
                        result.getString("name"),
                        result.getString("desc"),
                        result.getDate("date_birth"),
                        result.getBytes("image"));
            }
        }
        conn.close();
        return d;
    }


    public static boolean updateDirector(Director d, Connection conn) throws SQLException{
        boolean res = false;
        try (PreparedStatement ps = conn.prepareStatement("UPDATE director set id = ?, name = ?, description = ?, date_birth = ?, image = ? where id = ?")){
            ps.setInt(1, d.getId());
            ps.setString(2, d.getName());
            ps.setString(3, d.getDesc());
            ps.setDate(4, d.getDate_birth());
            ps.setBytes(5, d.getImage());
            ps.setInt(5, d.getId());
            ResultSet result = ps.executeQuery();
            System.out.println(result);
            if (result.next()){
                res = true;
            }
        }
        conn.close();
        return res;
    }
    public static ArrayList<Integer> getDirectedFilmList(int id, Connection conn) throws SQLException{
        ArrayList<Integer> arr = new ArrayList<Integer>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from direct where director_id = ?")){
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
        try (PreparedStatement ps = conn.prepareStatement("select * from director")){;
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(new Director(result.getInt("id"),
                        result.getString("name"),
                        result.getString("surname"),
                        result.getDate("date_birth"),
                        result.getBytes("image")));
            }
        }
        conn.close();
        return arr;
    }
}
