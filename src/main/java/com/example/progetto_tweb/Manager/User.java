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

}
