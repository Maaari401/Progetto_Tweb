package com.example.progetto_tweb.login;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.example.progetto_tweb.token.*;

import java.io.IOException;

@WebFilter(urlPatterns = "*")
public class AuthFilter extends HttpFilter {
    private static final String LOGIN_PATH = "/login";
    private static final String LOGOUT_PATH = "/logout";
    private static final String SINGUP_PATH = "/singup";


    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {

        if (req.getServletPath().equals(LOGIN_PATH) ||
                req.getServletPath().equals(LOGOUT_PATH) || req.getServletPath().equals(SINGUP_PATH)) {
            chain.doFilter(req, res);
            return;
        }
        String token = req.getHeader("token");

        if (token != null && token.startsWith("tok")) {
            try {
                token = token.replace("tok $", "");
                if (tokenManager.isUserActive(tokenManager.getUsernameFromToken(token)) &&  tokenManager.isValidToken(tokenManager.getUsernameFromToken(token), token)){
                    chain.doFilter(req, res);
                }else{
                    tokenManager.doLogOut(tokenManager.getUsernameFromToken(token));
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.getWriter().write("Token non valido");
                }
            } catch (Exception e) {
                e.printStackTrace();
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                res.getWriter().write("Token non valido");
            }
        } else {

            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("Non autorizzato");
        }
    }
}
