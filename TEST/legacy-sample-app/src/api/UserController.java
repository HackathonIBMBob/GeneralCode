package api;

import db.ConnectionPool;
import models.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class UserController extends HttpServlet {

    private ConnectionPool pool = new ConnectionPool();

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();
        response.setContentType("text/html");

        if (action.equals("getUser")) {
            String userId = request.getParameter("id");
            try {
                Connection conn = pool.getConnection();
                Statement stmt = conn.createStatement();
                String sql = "SELECT * FROM users WHERE id = " + userId;
                ResultSet rs = stmt.executeQuery(sql);

                if (rs.next()) {
                    out.println("<html><body>");
                    out.println("<p>ID: " + rs.getString("id") + "</p>");
                    out.println("<p>Name: " + rs.getString("name") + "</p>");
                    out.println("<p>Email: " + rs.getString("email") + "</p>");
                    out.println("</body></html>");
                }
            } catch (Exception e) {
                e.printStackTrace();
                out.println("Error: " + e.getMessage());
            }

        } else if (action.equals("listUsers")) {
            try {
                Connection conn = pool.getConnection();
                Statement stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery("SELECT * FROM users");

                out.println("<html><body><table border='1'>");
                out.println("<tr><th>ID</th><th>Name</th><th>Email</th><th>Active</th></tr>");
                while (rs.next()) {
                    String id = rs.getString("id");
                    String name = rs.getString("name");
                    String email = rs.getString("email");
                    String active = rs.getString("active");

                    out.println("<tr><td>" + id + "</td><td>" + name + "</td><td>"
                            + email + "</td><td>" + active + "</td></tr>");
                }
                out.println("</table></body></html>");
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else if (action.equals("searchUser")) {
            String name = request.getParameter("name");
            try {
                Connection conn = pool.getConnection();
                Statement stmt = conn.createStatement();
                String sql = "SELECT * FROM users WHERE name LIKE '%" + name + "%'";
                ResultSet rs = stmt.executeQuery(sql);

                out.println("<html><body>");
                while (rs.next()) {
                    out.println("<p>" + rs.getString("id") + " - " + rs.getString("name") + "</p>");
                }
                out.println("</body></html>");
            } catch (Exception e) {
                out.println("Search failed");
            }
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String action = request.getParameter("action");
        PrintWriter out = response.getWriter();

        if (action.equals("createUser")) {
            String name = request.getParameter("name");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String role = request.getParameter("role");

            try {
                Connection conn = pool.getConnection();
                Statement stmt = conn.createStatement();
                String sql = "INSERT INTO users (name, email, password, role) VALUES ('"
                        + name + "', '" + email + "', '" + password + "', '" + role + "')";
                stmt.executeUpdate(sql);

                String sql2 = "INSERT INTO audit_log (action, detail) VALUES ('CREATE_USER', 'Created user: " + email + "')";
                stmt.executeUpdate(sql2);

                out.println("User created successfully");
            } catch (Exception e) {
                e.printStackTrace();
                out.println("Error creating user");
            }

        } else if (action.equals("updateUser")) {
            String userId = request.getParameter("id");
            String name = request.getParameter("name");
            String email = request.getParameter("email");

            try {
                Connection conn = pool.getConnection();
                Statement stmt = conn.createStatement();
                String sql = "UPDATE users SET name = '" + name + "', email = '" + email
                        + "' WHERE id = " + userId;
                stmt.executeUpdate(sql);
                out.println("User updated");
            } catch (Exception e) {
                e.printStackTrace();
                out.println("Error updating user");
            }

        } else if (action.equals("deleteUser")) {
            String userId = request.getParameter("id");

            try {
                Connection conn = pool.getConnection();
                Statement stmt = conn.createStatement();
                String sql = "DELETE FROM users WHERE id = " + userId;
                stmt.executeUpdate(sql);
                out.println("User deleted");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
