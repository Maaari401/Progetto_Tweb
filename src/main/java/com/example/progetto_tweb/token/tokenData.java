package com.example.progetto_tweb.token;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.util.Date;

public class tokenData {
    final int EXPIRATION_SEC = 30 * 60 * 1000; //30 minuti in secondi
    private String token;
    private final boolean auth;
    private final Date expiration_time;
    public tokenData(String username, boolean auth) {
        this.token = generateToken(username);
        this.auth = auth;
        this.expiration_time = new Date();
        expiration_time.setTime(expiration_time.getTime() + EXPIRATION_SEC);
    }

    public String getToken() {
        return token;
    }

    public boolean isAuth() {
        return auth;
    }

    public boolean checkTime(){

        boolean a = this.expiration_time.after(new Date());
        return  a;
    }

    private static String generateToken(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = digest.digest(input.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashedBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return input;
        }
    }
}
