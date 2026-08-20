package com.stockscorcher.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class ApiClient {
    public static final String FIREBASE_API_KEY = "AIzaSyC5BRCY3NsUhTWQ2HjYEjZe_SVqz-jzS4w";
    public static final String PROJECT_ID = "stock-scorcher";
    public static final String BACKEND = "https://stock-scorcher-backend.onrender.com";

    private final Context context;
    private final SharedPreferences prefs;

    public ApiClient(Context context) {
        this.context = context.getApplicationContext();
        prefs = this.context.getSharedPreferences("stock_scorcher_session", Context.MODE_PRIVATE);
    }

    public boolean isLoggedIn() {
        return prefs.contains("idToken") && prefs.contains("uid");
    }

    public String getUid() { return prefs.getString("uid", ""); }
    public String getEmail() { return prefs.getString("email", ""); }
    public String getDisplayName() { return prefs.getString("displayName", ""); }

    public void logout() { prefs.edit().clear().apply(); }

    public JSONObject login(String email, String password) throws Exception {
        JSONObject body = new JSONObject();
        body.put("email", email);
        body.put("password", password);
        body.put("returnSecureToken", true);
        JSONObject result = postJson("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + FIREBASE_API_KEY, body, null);
        saveSession(result);
        return result;
    }

    public JSONObject register(String name, String email, String password) throws Exception {
        JSONObject body = new JSONObject();
        body.put("email", email);
        body.put("password", password);
        body.put("returnSecureToken", true);
        JSONObject result = postJson("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + FIREBASE_API_KEY, body, null);
        saveSession(result);
        if (name != null && !name.trim().isEmpty()) {
            JSONObject update = new JSONObject();
            update.put("idToken", getIdToken());
            update.put("displayName", name.trim());
            update.put("returnSecureToken", true);
            JSONObject updated = postJson("https://identitytoolkit.googleapis.com/v1/accounts:update?key=" + FIREBASE_API_KEY, update, null);
            saveSession(updated);
        }
        return result;
    }

    public void resetPassword(String email) throws Exception {
        JSONObject body = new JSONObject();
        body.put("requestType", "PASSWORD_RESET");
        body.put("email", email);
        postJson("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + FIREBASE_API_KEY, body, null);
    }

    public void updateProfile(String displayName) throws Exception {
        JSONObject body = new JSONObject();
        body.put("idToken", getIdToken());
        body.put("displayName", displayName == null ? "" : displayName.trim());
        body.put("returnSecureToken", true);
        JSONObject result = postJson("https://identitytoolkit.googleapis.com/v1/accounts:update?key=" + FIREBASE_API_KEY, body, null);
        saveSession(result);

        JSONObject user = new JSONObject();
        user.put("displayName", str(displayName));
        user.put("email", str(getEmail()));
        user.put("uid", str(getUid()));
        upsertFirestoreDocument("users/" + getUid(), user);
    }

    public String getIdToken() throws Exception {
        long expiresAt = prefs.getLong("expiresAt", 0);
        String token = prefs.getString("idToken", null);
        if (token == null) throw new IllegalStateException("Not logged in");
        if (System.currentTimeMillis() < expiresAt - 60_000L) return token;

        String refresh = prefs.getString("refreshToken", null);
        if (refresh == null) return token;
        String form = "grant_type=refresh_token&refresh_token=" + URLEncoder.encode(refresh, "UTF-8");
        JSONObject refreshed = postForm("https://securetoken.googleapis.com/v1/token?key=" + FIREBASE_API_KEY, form);
        String newToken = refreshed.optString("id_token", token);
        String newRefresh = refreshed.optString("refresh_token", refresh);
        long seconds = refreshed.optLong("expires_in", 3600);
        prefs.edit().putString("idToken", newToken).putString("refreshToken", newRefresh)
                .putLong("expiresAt", System.currentTimeMillis() + seconds * 1000L).apply();
        return newToken;
    }

    public JSONObject getFirestoreDocument(String path) throws Exception {
        String token = getIdToken();
        String url = "https://firestore.googleapis.com/v1/projects/" + PROJECT_ID + "/databases/(default)/documents/" + path;
        HttpResult r = request("GET", url, null, token);
        if (r.code == 404) return null;
        if (r.code >= 400) throw new Exception(errorMessage(r.body));
        return new JSONObject(r.body);
    }

    public JSONObject upsertFirestoreDocument(String path, JSONObject fields) throws Exception {
        String token = getIdToken();
        String url = "https://firestore.googleapis.com/v1/projects/" + PROJECT_ID + "/databases/(default)/documents/" + path;
        JSONObject body = new JSONObject().put("fields", fields);
        HttpResult r = request("PATCH", url, body.toString(), token);
        if (r.code >= 400) throw new Exception(errorMessage(r.body));
        return new JSONObject(r.body);
    }

    public JSONObject createOrder(int rupees) throws Exception {
        JSONObject body = new JSONObject().put("amount", rupees);
        HttpResult r = request("POST", BACKEND + "/create-order", body.toString(), null);
        if (r.code >= 400) throw new Exception(errorMessage(r.body));
        return new JSONObject(r.body);
    }

    public boolean verifyPayment(String orderId, String paymentId, String signature, int amount, Integer originalPrice) throws Exception {
        JSONObject body = new JSONObject();
        body.put("razorpay_order_id", orderId);
        body.put("razorpay_payment_id", paymentId);
        body.put("razorpay_signature", signature);
        body.put("email", getEmail());
        body.put("amount", amount);
        if (originalPrice != null) body.put("originalPrice", originalPrice);
        HttpResult r = request("POST", BACKEND + "/verify-payment", body.toString(), null);
        if (r.code >= 400) throw new Exception(errorMessage(r.body));
        return new JSONObject(r.body).optBoolean("success", false);
    }


    public org.json.JSONArray getFirestoreCollection(String collection) throws Exception {
        String token = getIdToken();
        String url = "https://firestore.googleapis.com/v1/projects/" + PROJECT_ID + "/databases/(default)/documents/" + collection + "?pageSize=100";
        HttpResult r = request("GET", url, null, token);
        if (r.code >= 400) throw new Exception(errorMessage(r.body));
        JSONObject root = new JSONObject(r.body);
        return root.optJSONArray("documents") == null ? new org.json.JSONArray() : root.optJSONArray("documents");
    }

    public JSONObject readUser() throws Exception { return getFirestoreDocument("users/" + getUid()); }
    public JSONObject readPurchase() throws Exception { return getFirestoreDocument("purchases/" + getUid()); }
    public JSONObject readMembership() throws Exception { return getFirestoreDocument("memberships/" + getUid()); }

    public static boolean hasCoursePurchase(JSONObject doc) {
        if (doc == null) return false;
        String purchased = fieldString(doc, "purchased");
        if ("true".equalsIgnoreCase(purchased)) return true;
        String paymentStatus = fieldString(doc, "paymentStatus");
        if ("paid".equalsIgnoreCase(paymentStatus) || "success".equalsIgnoreCase(paymentStatus) || "completed".equalsIgnoreCase(paymentStatus)) return true;
        return !purchaseName(doc).isEmpty() || !fieldString(doc, "planId").isEmpty() || !fieldString(doc, "course").isEmpty() || !fieldString(doc, "courseName").isEmpty();
    }

    public static String purchaseName(JSONObject doc) {
        if (doc == null) return "";
        String[] keys = {"planName", "courseName", "course", "plan", "title", "productName", "planId"};
        for (String key : keys) {
            String v = fieldString(doc, key);
            if (!v.isEmpty()) {
                if ("basic".equalsIgnoreCase(v)) return "Trading PDF & Cheat Sheets";
                if ("premium".equalsIgnoreCase(v)) return "Stock Scorcher Masterclass";
                if ("pro-mentorship".equalsIgnoreCase(v)) return "Pro Mentorship & Execution";
                return v;
            }
        }
        return "";
    }

    public static boolean hasActiveMembership(JSONObject doc) {
        if (doc == null) return false;
        String status = fieldString(doc, "status");
        if ("active".equalsIgnoreCase(status) || "paid".equalsIgnoreCase(status) || "success".equalsIgnoreCase(status)) {
            String expiry = membershipExpiry(doc);
            if (!expiry.isEmpty()) {
                try {
                    java.time.Instant t = java.time.Instant.parse(expiry);
                    if (t.isBefore(java.time.Instant.now())) return false;
                } catch (Exception ignored) { }
            }
            return true;
        }
        return !fieldString(doc, "plan").isEmpty() && !fieldString(doc, "paymentId").isEmpty();
    }

    public static String membershipExpiry(JSONObject doc) {
        if (doc == null) return "";
        String v = fieldString(doc, "expiryDate");
        if (v.isEmpty()) v = fieldString(doc, "expiresAt");
        if (v.isEmpty()) v = fieldString(doc, "expiry");
        return v;
    }

    public void saveCoursePurchase(String planId, String planName, int originalPrice, int paidAmount, String paymentId, String orderId) throws Exception {
        JSONObject fields = new JSONObject();
        fields.put("uid", str(getUid()));
        fields.put("email", str(getEmail()));
        fields.put("planId", str(planId));
        fields.put("planName", str(planName));
        fields.put("originalPrice", num(originalPrice));
        fields.put("paidAmount", num(paidAmount));
        fields.put("paymentId", str(paymentId));
        fields.put("orderId", str(orderId));
        fields.put("purchased", bool(true));
        fields.put("paymentStatus", str("paid"));
        fields.put("purchasedAt", str(java.time.Instant.now().toString()));
        upsertFirestoreDocument("purchases/" + getUid(), fields);

        if ("pro-mentorship".equals(planId)) {
            java.time.Instant expiry = java.time.Instant.now().plus(java.time.Duration.ofDays(365));
            JSONObject membership = new JSONObject();
            membership.put("uid", str(getUid()));
            membership.put("email", str(getEmail()));
            membership.put("plan", str("1 Year VIP Membership"));
            membership.put("status", str("active"));
            membership.put("expiresAt", str(expiry.toString()));
            membership.put("purchasedAt", str(java.time.Instant.now().toString()));
            upsertFirestoreDocument("memberships/" + getUid(), membership);
        }
    }

    public void saveMembership(String plan, int originalPrice, int paidAmount, String paymentId, String orderId) throws Exception {
        java.time.Instant expiry = "Monthly".equals(plan)
                ? java.time.Instant.now().plus(java.time.Duration.ofDays(31))
                : java.time.Instant.now().plus(java.time.Duration.ofDays(365));
        JSONObject membership = new JSONObject();
        membership.put("uid", str(getUid()));
        membership.put("email", str(getEmail()));
        membership.put("plan", str(plan));
        membership.put("originalPrice", num(originalPrice));
        membership.put("paidAmount", num(paidAmount));
        membership.put("appliedCoupon", new JSONObject().put("nullValue", JSONObject.NULL));
        membership.put("status", str("active"));
        membership.put("purchasedAt", str(java.time.Instant.now().toString()));
        membership.put("expiryDate", str(expiry.toString()));
        membership.put("paymentId", str(paymentId));
        membership.put("orderId", str(orderId));
        upsertFirestoreDocument("memberships/" + getUid(), membership);

        JSONObject user = new JSONObject();
        user.put("premium", bool(true));
        user.put("membershipStatus", str("active"));
        user.put("membershipPlan", str(plan));
        user.put("membershipExpiry", str(expiry.toString()));
        upsertFirestoreDocument("users/" + getUid(), user);
    }

    public static String fieldString(JSONObject doc, String key) {
        if (doc == null) return "";
        JSONObject fields = doc.optJSONObject("fields");
        if (fields == null) return "";
        JSONObject f = fields.optJSONObject(key);
        if (f == null) return "";
        if (f.has("stringValue")) return f.optString("stringValue", "");
        if (f.has("integerValue")) return f.optString("integerValue", "");
        if (f.has("doubleValue")) return f.optString("doubleValue", "");
        if (f.has("booleanValue")) return String.valueOf(f.optBoolean("booleanValue", false));
        return "";
    }

    public static boolean fieldBoolean(JSONObject doc, String key) {
        return "true".equalsIgnoreCase(fieldString(doc, key));
    }

    private void saveSession(JSONObject result) {
        String idToken = result.optString("idToken", "");
        String refreshToken = result.optString("refreshToken", "");
        String uid = result.optString("localId", "");
        String email = result.optString("email", "");
        String display = result.optString("displayName", "");
        long seconds = result.optLong("expiresIn", 3600);
        prefs.edit().putString("idToken", idToken).putString("refreshToken", refreshToken)
                .putString("uid", uid).putString("email", email).putString("displayName", display)
                .putLong("expiresAt", System.currentTimeMillis() + seconds * 1000L).apply();
    }

    private static JSONObject str(String value) throws Exception { return new JSONObject().put("stringValue", value == null ? "" : value); }
    private static JSONObject num(int value) throws Exception { return new JSONObject().put("integerValue", value); }
    private static JSONObject bool(boolean value) throws Exception { return new JSONObject().put("booleanValue", value); }

    private JSONObject postJson(String url, JSONObject body, String bearer) throws Exception {
        HttpResult r = request("POST", url, body.toString(), bearer);
        if (r.code >= 400) throw new Exception(errorMessage(r.body));
        return new JSONObject(r.body);
    }

    private JSONObject postForm(String url, String form) throws Exception {
        HttpResult r = request("POST", url, form, null, "application/x-www-form-urlencoded");
        if (r.code >= 400) throw new Exception(errorMessage(r.body));
        return new JSONObject(r.body);
    }

    private HttpResult request(String method, String url, String body, String bearer) throws Exception {
        return request(method, url, body, bearer, "application/json");
    }

    private HttpResult request(String method, String url, String body, String bearer, String contentType) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setRequestMethod(method);
        c.setConnectTimeout(20000);
        c.setReadTimeout(30000);
        c.setRequestProperty("Accept", "application/json");
        if (contentType != null) c.setRequestProperty("Content-Type", contentType);
        if (bearer != null && !bearer.isEmpty()) c.setRequestProperty("Authorization", "Bearer " + bearer);
        if (body != null) {
            c.setDoOutput(true);
            try (OutputStream os = c.getOutputStream()) { os.write(body.getBytes(StandardCharsets.UTF_8)); }
        }
        int code = c.getResponseCode();
        InputStream stream = code >= 400 ? c.getErrorStream() : c.getInputStream();
        String response = read(stream);
        c.disconnect();
        return new HttpResult(code, response);
    }

    private static String read(InputStream in) throws Exception {
        if (in == null) return "";
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
            String line; while ((line = br.readLine()) != null) sb.append(line);
        }
        return sb.toString();
    }

    private static String errorMessage(String body) {
        try {
            JSONObject o = new JSONObject(body);
            JSONObject e = o.optJSONObject("error");
            if (e != null) {
                JSONArray errors = e.optJSONArray("errors");
                if (errors != null && errors.length() > 0) return errors.optJSONObject(0).optString("message", e.optString("message", body));
                return e.optString("message", body);
            }
        } catch (Exception ignored) {}
        return body == null || body.isEmpty() ? "Request failed" : body;
    }

    private static class HttpResult {
        final int code; final String body;
        HttpResult(int code, String body) { this.code = code; this.body = body; }
    }
}
