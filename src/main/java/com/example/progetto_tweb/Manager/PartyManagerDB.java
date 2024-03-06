package tweb.rpgpc.rpgdb;

import tweb.rpgpc.db.PoolingPersistenceManager;
import tweb.rpgpc.login.LoginService;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

public class PartyManagerDB {
    private static PartyManagerDB manager;
    private final PoolingPersistenceManager persistence;

    private PartyManagerDB() {
        persistence = PoolingPersistenceManager.getPersistenceManager();
    }

    /* public ArrayList<CharacterDB> getPartyCharacterList(String party) {
        ArrayList<CharacterDB> list = new ArrayList<>();
        try (Connection conn = persistence.getConnection()) {
            list = CharacterDB.loadCharactersInParty(party, conn);
        } catch (SQLException ex) {}
        return list;
    } */

    /* public ArrayList<CharacterDB> getPotentialPartyCharacters(String partyName) {
        ArrayList<CharacterDB> list = new ArrayList<>();
        try (Connection conn = persistence.getConnection()) {
            list = CharacterDB.loadCharactersNotInParty(partyName, conn);
        } catch (SQLException ex) {}
        return list;
    } */


    public ArrayList<CharacterDB> getAllCharacters(String ordercol) {
        ArrayList<CharacterDB> ret = new ArrayList<>();
        try (Connection conn = persistence.getConnection()) {
            ret = CharacterDB.loadAllCharacters(conn, ordercol);
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return ret;

    }
    public CharacterDB getCharacter(int id) {
        CharacterDB ret = null;
        try (Connection conn = persistence.getConnection()) {
            ret = CharacterDB.loadCharacter(id, conn);
        } catch (SQLException ex) {
        }
        return ret;
    }

    public PartyDB getParty(String username, String shortName) {
        PartyDB p = null;
        try (Connection conn = persistence.getConnection()) {
            if (username.equals(LoginService.FAKELOGIN)) p = PartyDB.loadParty(shortName, conn);
            else p = PartyDB.loadParty(username, shortName, conn);
        } catch (SQLException ex) {
        }
        return p;
    }

    public ArrayList<PartyDB> getParties() {
        ArrayList<PartyDB> list = null;
        try (Connection conn = persistence.getConnection()) {
            list = PartyDB.loadAllParties(conn);
        } catch (SQLException ex) {
        }
        return list;
    }

    public ArrayList<HashMap<String, String>> getPartiesShort(String username) {
        ArrayList<HashMap<String, String>>list = null;
        try (Connection conn = persistence.getConnection()) {
            if (username.equals(LoginService.FAKELOGIN)) list = PartyDB.loadAllPartiesShort(conn);
            else list = PartyDB.loadAllPartiesShort(username, conn);
        } catch (SQLException ex) {
        }
        return list;
    }

    public int createCharacter(String name, int level, String rpgclass, String[] description) {
        int ret = -1;
        CharacterDB c = new CharacterDB(-1, name, level, rpgclass, description);
        try (Connection conn = persistence.getConnection()) {
             CharacterDB.saveCharacter(c, conn);
             ret = c.getId();
        } catch (SQLException ex) {
        }
        return ret;
    }

    public boolean deleteCharacter(int charId) {
        boolean deleted = false;
        try (Connection conn = persistence.getConnection()) {
            CharacterDB c = CharacterDB.loadCharacter(charId, conn);
            if (c != null && c.canDelete(conn)) {
                deleted = c.delete(conn);
            }
        } catch (SQLException ex) {
        }
        return deleted;
    }


    public boolean updateCharacter(CharacterDB c) {
        boolean updated = false;
        try (Connection conn = persistence.getConnection()) {
                updated = c.saveUpdate(conn);
        } catch (SQLException ex) {
        }
        return updated;
    }

    public int addNewCharacter(CharacterDB c) {
        int ret = 0;
        try (Connection conn = persistence.getConnection()) {
            ret = c.saveAsNew(conn);
        } catch (SQLException ex) {
        }
        return ret;
    }

    public String addNewParty(String username, PartyDB p) {
        String ret = "";
        try (Connection conn = persistence.getConnection()) {
            ret = p.saveAsNew(username, conn);
        } catch (SQLException ex) {
        }
        return ret;
    }

    public boolean deleteParty(String username, String shortName) {
        boolean deleted = false;
        try (Connection conn = persistence.getConnection()) {
            PartyDB p = null;
            if (username.equals(LoginService.FAKELOGIN)) p = PartyDB.loadParty(shortName, conn);
            else p = PartyDB.loadParty(username, shortName, conn);
            if (p != null) {
                deleted = p.delete(conn);
            }
        } catch (SQLException ex) {
        }
        return deleted;    }

    public boolean updateParty(String username, PartyDB p) {
        boolean updated = false;
        if (!username.equals(LoginService.FAKELOGIN) && !username.equals(p.getOwner())) return updated;
        try (Connection conn = persistence.getConnection()) {
            updated = p.saveUpdate(conn);
        } catch (SQLException ex) {
        }
        return updated;
    }


    public boolean addCharacterToParty(String username, String partyName, int charId) {
        boolean updated = false;
        try (Connection conn = persistence.getConnection()) {
            PartyDB p = null;
            if (username.equals(LoginService.FAKELOGIN)) p = PartyDB.loadParty(partyName, conn);
            else p = PartyDB.loadParty(username, partyName, conn);
            if (p != null) {
                updated = p.addCharacter(charId, conn);
            }
        } catch (SQLException ex) {
        }
        return updated;
    }

    public boolean removeCharacterFromParty(String username, String partyName, int charId) {
        boolean updated = false;
        try (Connection conn = persistence.getConnection()) {
            PartyDB p = null;
            if (username.equals(LoginService.FAKELOGIN)) p = PartyDB.loadParty(partyName, conn);
            else p = PartyDB.loadParty(username, partyName, conn);
            if (p != null) {
                updated = p.removeCharacter(charId, conn);
            }
        } catch (SQLException ex) {
        }
        return updated;
    }

    public boolean validateCredentials(String username, String password) {
        boolean result = false;
        try (Connection conn = PoolingPersistenceManager.getPersistenceManager().getConnection();
             PreparedStatement st = conn.prepareStatement("SELECT * FROM users " +
                     "WHERE username = ? AND password = ?");) {
            st.setString(1, username);
            st.setString(2, password);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                result = true;
            }

        } catch (SQLException ex) {
        }
        return result;
    }

    /* public boolean addCharacterToParty(String partyname, int charId) {
        boolean added = false;
        try (Connection conn = persistence.getConnection()) {
             added = PartyDB.saveMemberInParty(partyname, charId, conn);
        } catch (SQLException ex) {
        }
        return added;
    } */

    /* public boolean createParty(String shortname, String name) {
        boolean ret = false;
        PartyDB p = new PartyDB(name, shortname);
        try (Connection conn = persistence.getConnection()) {
            ret = PartyDB.saveParty(p, conn);
        } catch (SQLException ex) {
        }
        return ret;
    } */

    public static PartyManagerDB getManager() {
        if (manager == null) {
            manager = new PartyManagerDB();
        }
        return manager;
    }
}
