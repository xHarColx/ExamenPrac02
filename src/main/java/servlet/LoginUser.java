/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dao.ClienteJpaController;
import dto.Cliente;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import util.JwtUtil;

/**
 *
 * @author harol
 */
@WebServlet(name = "LoginUser", urlPatterns = {"/login-normal"})
public class LoginUser extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        Gson gson = new Gson();
        JsonObject jsonObject = new JsonObject();

        try ( PrintWriter out = response.getWriter();  BufferedReader reader = request.getReader()) {

            JsonObject json = gson.fromJson(reader, JsonObject.class);
            String log = json.get("log").getAsString();
            String pass = json.get("pass").getAsString();

            Cliente usuario = new ClienteJpaController().validarUsuario(new Cliente(log, pass));

            if (usuario != null) {
                String token = JwtUtil.generarToken(log);
                jsonObject.addProperty("result", "ok");
                jsonObject.addProperty("token", token);
                jsonObject.addProperty("codiClie", usuario.getCodiClie());
                jsonObject.addProperty("logiClie", usuario.getLogiClie());
                jsonObject.addProperty("passClie", usuario.getPassClie());
            } else {
                jsonObject.addProperty("result", "not");
                jsonObject.addProperty("message", "credenciales inválidas");
            }

            out.print(gson.toJson(jsonObject));
            out.flush();

        } catch (Exception ex) {
            // Logueas...
            Logger.getLogger(LoginUser.class.getName()).log(Level.SEVERE, null, ex);
            // Y envías siempre un JSON de error al cliente
            try ( PrintWriter out = response.getWriter()) {
                jsonObject = new JsonObject();
                jsonObject.addProperty("result", "error");
                jsonObject.addProperty("message", "Error interno del servidor");
                out.print(gson.toJson(jsonObject));
                out.flush();
            }
        }
    }

}
