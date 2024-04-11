package com.example.progetto_tweb.token;

import jakarta.servlet.http.HttpSession;

import java.util.HashMap;
import java.util.Map;

public class tokenManager {
    private static final Map<String, tokenData> userTokens = new HashMap<>();
    private static final String SESSION_USER_KEY = "user";

    public static String addToken(String username, boolean auth) {
        tokenData tdata = new tokenData(username, auth);
        userTokens.put(username, tdata);
        return tdata.getToken();
    }

    public static boolean isUserActive(String username) {
        return userTokens.containsKey(username);
    }

    public static boolean removeToken(String username) {
        if (userTokens.containsKey(username)) {
            userTokens.remove(username);
            return true;
        } else {
            return false;
        }
    }

    public static boolean isValidToken(String username, String token) {
        token = token.replace("Bearer $", "");
        return (
                userTokens.containsKey(username) &&
                        userTokens.get(username).getToken().equals(token)
        );
    }

    public static boolean getAuth(String username) {
        if (userTokens.containsKey(username)) {
            return userTokens.get(username).isAuth();
        } else {
            return false;
        }
    }

    public static String getUsernameFromToken(String token) {
        token = token.replace("tok $", "");
        for (Map.Entry<String, tokenData> entry : userTokens.entrySet()) {
            if (entry.getValue().getToken().equals(token)) {
                return entry.getKey();
            }
        }

        // Restituisci null se il token non è associato a un username
        return null;
    }

    public static boolean doLogOut(String username) {
        return userTokens.remove(username) == null;
    }
}
