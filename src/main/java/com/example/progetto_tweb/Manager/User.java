package com.example.progetto_tweb.Manager;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class User {

    public static boolean validateCredentials(String username, String password, Connection conn) throws SQLException {
        boolean result = false;
        try (PreparedStatement st = conn.prepareStatement("SELECT * FROM users WHERE username = ? AND pwd = ?");) {
            st.setString(1, username);
            st.setString(2, password);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                result = true;
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
}
