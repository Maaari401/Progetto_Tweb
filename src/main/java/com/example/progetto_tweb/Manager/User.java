package com.example.progetto_tweb.Manager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;

public class User {

    private String email;
    private String username;
    private String pwd;

    public User(String email, String username, String pwd, int id) {
        this.email = email;
        this.username = username;
        this.pwd = pwd;
    }

    public static int validateCredentials(String username, String password, Connection conn) throws SQLException {
        int result = -1;
        try (PreparedStatement st = conn.prepareStatement("SELECT id FROM users WHERE username = ? AND pwd = ?");) {
            st.setString(1, username);
            st.setString(2, password);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                result = rs.getInt(1);
            }
        }
        return result;
    }

    public static boolean checkAuth(String username, String password, Connection conn) throws SQLException {
        boolean result = false;
        try (PreparedStatement st = conn.prepareStatement("SELECT auth FROM users WHERE username = ? AND pwd = ?");) {
            st.setString(1, username);
            st.setString(2, password);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                result = rs.getBoolean("auth");
            }
        }
        return result;
    }




    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public String getPwd() {
        return pwd;
    }


    public static void newUser(User user, Connection conn) throws SQLException {
        try (PreparedStatement ps = conn.prepareStatement("insert into users (email, username, pwd, auth) values (?,?,?,?)")){
            ps.setString(1, user.getEmail());
            ps.setString(2, user.getUsername());
            ps.setString(3, user.getPwd());
            ps.setBoolean(4, false);
            ps.executeUpdate();
        }
        
    }

    public static void setWached(int uId, int filmId, Connection conn) throws SQLException{
        try (PreparedStatement ps = conn.prepareStatement("insert into watched (user_id, film_id) values (?,?)")){
            ps.setInt(1, uId);
            ps.setInt(2, filmId);
            ps.executeUpdate();
        }
    }

    public static void setLiked(int uId, int filmId, boolean like, Connection conn) throws SQLException{

        try (PreparedStatement ps = conn.prepareStatement("SELECT liked FROM watched where film_id = ? AND user_id = ?")){
            ps.setInt(1, filmId);
            ps.setInt(2, uId);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                try (PreparedStatement ps2 = conn.prepareStatement("UPDATE watched SET liked = ? WHERE film_id = ? AND user_id = ?")){
                    ps2.setBoolean(1, like);
                    ps2.setInt(2, filmId);
                    ps2.setInt(3, uId);
                    ps2.executeUpdate();
                }
            }else{
                try{
                    conn.setAutoCommit(false);
                    setWached(uId, filmId, conn);
                    PreparedStatement ps2 = conn.prepareStatement("UPDATE watched SET liked = ? WHERE film_id = ? AND user_id = ?");
                    ps2.setBoolean(1, like);
                    ps2.setInt(2, filmId);
                    ps2.setInt(3, uId);
                    ps2.executeUpdate();

                    conn.commit();
                }catch (Exception e){
                    conn.rollback();
                }

            }
        }

    }
    public static void remWached(int uId, int filmId, Connection conn) throws SQLException{
        try (PreparedStatement ps = conn.prepareStatement("DELETE FROM watched where film_id = ? AND user_id = ?")){
            ps.setInt(1, filmId);
            ps.setInt(2, uId);
            ps.executeUpdate();
        }
    }

    public static boolean[] checkValues(int uId, int filmId, Connection conn) throws SQLException {
        boolean[] res = {false, false};
        try (PreparedStatement ps = conn.prepareStatement("SELECT liked FROM watched where film_id = ? AND user_id = ?")){
            ps.setInt(1, filmId);
            ps.setInt(2, uId);
            ResultSet rs = ps.executeQuery();
            if(rs.next()){
                res[0] = true;
                res[1] = rs.getBoolean(1);
            }
        }
        return res;
    }

}
