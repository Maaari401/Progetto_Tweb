package com.example.progetto_tweb.Manager;

import com.example.progetto_tweb.db.*;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

public class ManagerDB {
    private static ManagerDB manager;
    public final PoolingPersistenceManager persistence;

    public ManagerDB() {
        persistence = PoolingPersistenceManager.getPersistenceManager();
    }

    public static ManagerDB getManager() {
        if (manager == null) {
            manager = new ManagerDB();
        }
        return manager;
    }
}
