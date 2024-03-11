package com.example.progetto_tweb.Manager;

import java.sql.*;
import java.util.ArrayList;

public class Actor {
    private int id;
    private String name;
    private String surname;
    private Date date_birth;

    public Actor(int id, String name, String surname, Date date_birth) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.date_birth = date_birth;
    }
    public Actor() {

    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public Date getDate_birth() {
        return date_birth;
    }

    @Override
    public String toString() {
        return "Actor{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", date_birth=" + date_birth +
                '}';
    }

    public Actor loadActor(int cod, Connection conn) throws SQLException {
        Actor actor = null;
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from actors where id = ?")){
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            if (result.next()){
                actor = new Actor(result.getInt("id"),
                        result.getString("name"),
                        result.getString("surname"),
                        result.getDate("date_birth"));
            }
        }
        return actor;
    }

    public void updateActor(Actor a, Connection conn) throws SQLException{
        try (PreparedStatement ps = conn.prepareStatement("UPDATE actors set id = ?, name = ?, surname = ?, date_birth = ? where id = ?")){
            ps.setInt(1, a.getId());
            ps.setString(2, a.getName());
            ps.setString(3, a.getSurname());
            ps.setDate(4, a.getDate_birth());
            ps.setInt(5, a.getId());
            ResultSet result = ps.executeQuery();

            System.out.println(result);
            if (result.next()){

            }
        }
    }
    public ArrayList<Integer> getFilmList(int cod, Connection conn) throws SQLException{
        ArrayList<Integer> arr = new ArrayList<Integer>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT * from act where id_actor = ?")){
            ps.setInt(1, cod);
            ResultSet result = ps.executeQuery();
            while (result.next()){
                arr.add(result.getInt("film_id"));
            }
        }
        return arr;
    }
}
