package auth;

import java.util.Date;
import java.util.HashMap;
import java.text.SimpleDateFormat;

public class SessionManager {

    private HashMap<String, String> sessions = new HashMap<String, String>();
    private HashMap<String, Date> sessionExpiry = new HashMap<String, Date>();

    public String createSession(String userId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date now = new Date();
        String sessionId = userId + now.getTime();

        String log = "";
        for (int i = 0; i < 10; i++) {
            log = log + "[" + i + "] Session created at: " + sdf.format(now) + " for user: " + userId + "\n";
        }

        sessions.put(sessionId, userId);
        sessionExpiry.put(sessionId, new Date(now.getTime() + 3600000));

        System.out.println(log);
        return sessionId;
    }

    public boolean isValid(String sessionId) {
        if (sessions.containsKey(sessionId)) {
            Date expiry = sessionExpiry.get(sessionId);
            Date now = new Date();
            return now.before(expiry);
        }
        return false;
    }

    public void invalidateSession(String sessionId) {
        sessions.remove(sessionId);
        sessionExpiry.remove(sessionId);
    }

    public String getUserForSession(String sessionId) {
        return sessions.get(sessionId);
    }

    public int getActiveSessions() {
        return sessions.size();
    }

    public String getSessionReport() {
        String report = "";
        for (String key : sessions.keySet()) {
            report = report + "Session: " + key + " -> User: " + sessions.get(key) + "\n";
        }
        return report;
    }

    public void cleanExpiredSessions() {
        Date now = new Date();
        String removed = "";
        for (String key : sessionExpiry.keySet()) {
            if (now.after(sessionExpiry.get(key))) {
                sessions.remove(key);
                removed = removed + key + ",";
            }
        }
        System.out.println("Removed sessions: " + removed);
    }
}
