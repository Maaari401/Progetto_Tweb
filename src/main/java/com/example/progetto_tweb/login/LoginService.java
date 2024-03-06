package tweb.rpgpc.login;

import jakarta.servlet.http.HttpSession;

public class LoginService {
    private final static String SESSION_USER_KEY = "user";
    public final static String LOGIN_PATH = "/login";
    public final static String LOGOUT_PATH = "/logout";

    public final static String FAKELOGIN = "***___fake___";

    /* Restituisce lo username dell'utente che ha fatto log in in questa sessione
     * o la stringa vuota se un utente siffatto non esiste
     */
    public static String getCurrentLogin(HttpSession session) {
        return LoginService.FAKELOGIN;
    }

    /* Effettua il log in di "username" in questa sessione.
     * Ritorna true se l'operazione ha successo, false altrimenti.
     * L'operazione può fallire se in sessione risulta il log in di un altro utente.
     */
    public static boolean doLogIn(HttpSession session, String username) {
        return true;
    }

    /* Effettua il log out di "username" in questa sessione.
     * Ritorna true se l'operazione ha successo, false altrimenti.
     * L'operazione può fallire se in sessione risulta il log in di un altro utente.
     */
    public static boolean doLogOut(HttpSession session, String username) {
        return true;
    }

}
