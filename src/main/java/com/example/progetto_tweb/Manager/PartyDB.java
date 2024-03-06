package tweb.rpgpc.rpgdb;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

public class PartyDB {
    private String name;
    private String shortname;

    private String owner;
    private final ArrayList<Integer> characters = new ArrayList<>();

    public PartyDB(String name, String shortname, String owner) {
        this.name = name;
        this.shortname = shortname;
        this.owner = owner;
    }

    public static boolean saveMemberInParty(String partyname, int charId, Connection conn)
            throws SQLException {
        boolean saved = false;
        try (PreparedStatement st = conn.prepareStatement("INSERT INTO " +
                "rpgpc.partymembers (party_name, character_id) " +
                "VALUES (?, ?) " +
                "on conflict (party_name, character_id) do nothing")) {
            st.setString(1, partyname);
            st.setInt(2, charId);
            int a = st.executeUpdate();
            if (a > 0) saved = true;
        }
        return saved;
    }

    public static boolean saveParty(PartyDB p, Connection conn)
            throws SQLException {
        boolean ret = false;
        try (PreparedStatement st = conn.prepareStatement("INSERT INTO party (name, shortname, owner) " +
                "VALUES (?, ?, ?)")) {
            st.setString(1, p.name);
            st.setString(2, p.shortname);
            st.setString(3, "spock"); // temporaneo! deve prendere l'utente corrente
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                ret = true;
            }
        }
        return ret;
    }

    public int[] getCharacterIds() {
        int[] ret = new int[characters.size()];
        for (int i = 0; i < characters.size(); i++) {
            ret[i] = characters.get(i);
        }
        return ret;
    }

    public String getName() {
        return name;
    }

    public String getShortname() {
        return shortname;
    }


    public String getOwner() {
        return owner;
    }

    public boolean hasCharacter(int id) {
        return characters.stream().anyMatch(val -> val == id);
    }


    public String saveAsNew(String username, Connection conn) throws SQLException {
        conn.setAutoCommit(false);
        String ret;
        try (PreparedStatement st = conn.prepareStatement("INSERT INTO party (name, shortname, owner) " +
                "VALUES (?, ?, ?)")) {
            st.setString(1, name);
            st.setString(2, shortname);
            st.setString(3, username);
            st.executeUpdate();
            try (PreparedStatement st2 = conn.prepareStatement("INSERT INTO partymembers " +
                    "(party_name, character_id) VALUES (?, ?)")) {
                st2.setString(1, shortname);
                for (int id : characters) {
                    st2.setInt(2, id);
                    st2.executeUpdate();
                }
            }
            ret = shortname;
            owner = username;
            conn.commit();
        } catch (SQLException ex) {
            conn.rollback();
            throw ex;
        } finally {
            conn.setAutoCommit(true);
        }
        return ret;
    }


    public boolean saveUpdate(Connection conn) throws SQLException {
        boolean ret = false;
        try (PreparedStatement st = conn.prepareStatement("UPDATE party SET name " +
                "= ? WHERE shortname = ?")) {
            st.setString(1, name);
            st.setString(2, shortname);
            int upd = st.executeUpdate();
            if (upd > 0) {
                ret = true;
            }
        }
        return ret;
    }

    public boolean delete(Connection conn) throws SQLException {
        conn.setAutoCommit(false);
        boolean deleted = false;
        try (PreparedStatement stMembers = conn.prepareStatement("DELETE FROM partymembers WHERE party_name = ?")) {
            stMembers.setString(1, shortname);
            stMembers.executeUpdate();

            try (PreparedStatement st = conn.prepareStatement("DELETE FROM party WHERE shortname = ?")) {
                st.setString(1, shortname);
                int n = st.executeUpdate();
                if (n > 0) deleted = true;
                conn.commit();
            }
        } catch (SQLException ex) {
            conn.rollback();
            throw ex;
        } finally {
            conn.setAutoCommit(true);
        }

        return deleted;
    }


    public boolean addCharacter(int charId, Connection conn) throws SQLException {
        boolean updated = false;
        try (PreparedStatement st = conn.prepareStatement("INSERT INTO " +
                "partymembers (party_name, character_id) " +
                "VALUES (?, ?) " +
                "on conflict (party_name, character_id) do nothing")) {
            st.setString(1, shortname);
            st.setInt(2, charId);
            int val = st.executeUpdate();
            if (val > 0) updated = true;
        }
        return updated;
    }


    public boolean removeCharacter(int charId, Connection conn) throws SQLException {
        boolean updated = false;
        try (PreparedStatement st = conn.prepareStatement("DELETE FROM " +
                "partymembers WHERE party_name = ? AND character_id = ?")) {
            st.setString(1, shortname);
            st.setInt(2, charId);
            int val = st.executeUpdate();
            if (val > 0) updated = true;
        }
        return updated;
    }

    public static PartyDB loadParty(String username, String shortname, Connection conn)
            throws SQLException {
        PartyDB p = null;
        try (PreparedStatement stParty = conn.prepareStatement("SELECT * FROM party " +
                "WHERE shortname = ? AND " + "owner = ?")) {
            stParty.setString(1, shortname);
            stParty.setString(2, username);
            ResultSet rsParty = stParty.executeQuery();
            if (rsParty.next()) {
                p = new PartyDB(rsParty.getString("name"),
                        rsParty.getString("shortname"),
                        rsParty.getString("owner"));
                try (PreparedStatement stMembers = conn.prepareStatement("SELECT * FROM rpgpc.partymembers " +
                        "WHERE party_name = ?")) {
                    stMembers.setString(1, shortname);
                    ResultSet rsMembers = stMembers.executeQuery();
                    while (rsMembers.next()) {
                        p.characters.add(rsMembers.getInt("character_id"));
                    }
                }

            }
        }
        return p;
    }

    public static PartyDB loadParty(String shortname, Connection conn)
            throws SQLException {
        PartyDB p = null;
        try (PreparedStatement stParty = conn.prepareStatement("SELECT * FROM party " +
                "WHERE shortname = ?")) {
            stParty.setString(1, shortname);
            ResultSet rsParty = stParty.executeQuery();
            if (rsParty.next()) {
                p = new PartyDB(rsParty.getString("name"),
                        rsParty.getString("shortname"),
                        rsParty.getString("owner"));
                try (PreparedStatement stMembers = conn.prepareStatement("SELECT * FROM rpgpc.partymembers " +
                        "WHERE party_name = ?")) {
                    stMembers.setString(1, shortname);
                    ResultSet rsMembers = stMembers.executeQuery();
                    while (rsMembers.next()) {
                        p.characters.add(rsMembers.getInt("character_id"));
                    }
                }

            }
        }
        return p;
    }

    public static ArrayList<PartyDB> loadAllParties(Connection conn)
            throws SQLException {
        ArrayList<PartyDB> ret = new ArrayList<>();
        try (PreparedStatement stParties = conn.prepareStatement("SELECT * FROM rpgpc.party")) {
            ResultSet rsParties = stParties.executeQuery();
            while (rsParties.next()) {
                PartyDB p = new PartyDB(rsParties.getString("name"),
                        rsParties.getString("shortname"),
                        rsParties.getString("owner"));
                try (PreparedStatement stMembers = conn.prepareStatement("SELECT * FROM rpgpc.partymembers " +
                        "WHERE party_name = ?")) {
                    stMembers.setString(1, p.shortname);
                    ResultSet rsMembers = stMembers.executeQuery();
                    while (rsMembers.next()) {
                        p.characters.add(rsMembers.getInt("character_id"));
                    }
                }
                ret.add(p);
            }
        }
        return ret;
    }

    public static ArrayList<HashMap<String, String>> loadAllPartiesShort(String username, Connection conn)
            throws SQLException {
        ArrayList<HashMap<String, String>> ret = new ArrayList<>();
        try (PreparedStatement stParties = conn.prepareStatement("SELECT * FROM party " +
                "WHERE owner = ? " +
                "ORDER BY name")) {
            stParties.setString(1, username);
            ResultSet rsParties = stParties.executeQuery();
            while (rsParties.next()) {
                HashMap<String, String> result = new HashMap<>();
                result.put("name", rsParties.getString("name"));
                result.put("shortname", rsParties.getString("shortname"));
                ret.add(result);
            }
        }
        return ret;
    }

    public static ArrayList<HashMap<String, String>> loadAllPartiesShort(Connection conn)
            throws SQLException {
        ArrayList<HashMap<String, String>> ret = new ArrayList<>();
        try (PreparedStatement stParties = conn.prepareStatement("SELECT * FROM party " +
                "ORDER BY name")) {
            ResultSet rsParties = stParties.executeQuery();
            while (rsParties.next()) {
                HashMap<String, String> result = new HashMap<>();
                result.put("name", rsParties.getString("name"));
                result.put("shortname", rsParties.getString("shortname"));
                ret.add(result);
            }
        }
        return ret;
    }
}
