package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.dao_models.DaoCuenta;
import com.unl.sistema.base.controller.dao.dao_models.DaoRol;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import io.micrometer.common.lang.NonNull;
import jakarta.annotation.Nonnull;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed

public class CuentaService {
    private DaoCuenta dc;
    private SecurityContext context;

    public CuentaService() {
        dc = new DaoCuenta();
        context = SecurityContextHolder.getContext();
    }

    public HashMap<String, String> createRoles() {
        HashMap<String, String> mapa = new HashMap<>();
        mapa.put("resp", "Ya creado");
        mapa.put("code", "201");
        DaoRol dr = new DaoRol();
        if (dr.listAll().isEmpty()) {
            dr.getObj().setNombre("admin");
            dr.save();
            dr.setObj(null);
            dr.getObj().setNombre("user");
            dr.save();
            dr.setObj(null);
            mapa.put("resp", "Creado");
            mapa.put("code", "200");
        }
        return mapa;
    }

    public HashMap<String, String> createUsuarios() throws Exception {
        HashMap<String, String> mapa = new HashMap<>();
        mapa.put("resp", "Ya creado");
        mapa.put("code", "201");
        DaoUsuario du = new DaoUsuario();
        LinkedList<HashMap<String, String>> resultado = Utiles.busquedaLineal(
                dc.all(), "correo", "admin@gmail.com", 0);
        if (resultado.isEmpty()) {
            dc.getObj().setCorreo("admin@gmail.com");
            dc.getObj().setClave("12345");
            dc.save();

            du.getObj().setNickname("admin");
            du.getObj().setNombre("Administrador");
            du.getObj().setApellido("Principal");
            du.getObj().setCedula("0000000000");
            du.getObj().setTelefono("0000000000");
            du.getObj().setIdCuenta(1);
            du.getObj().setIdRol(1);
            du.save();
            du.setObj(null);
            mapa.put("resp", "Creado");
            mapa.put("code", "200");
        }
        return mapa;
    }

    public HashMap<String, String> view_rol() {
        HashMap<String, String> mapa = new HashMap<>();
        if (context.getAuthentication() != null) {
            Object obj[] = context.getAuthentication().getAuthorities().toArray();
            mapa.put("rol", obj[0].toString());
        }
        return mapa;
    }

    public Authentication getAuthentication() {
        return context.getAuthentication();
    }

    public Boolean isLogin() {
        if (getAuthentication() != null) {
            return getAuthentication().isAuthenticated();
        } else {
            return false;
        }
    }

    private static List<GrantedAuthority> getAuthorities(HashMap<String, Object> user) throws Exception {
        DaoRol dr = new DaoRol();
        dr.setObj(dr.get(Integer.parseInt(user.get("rol").toString())));
        List<GrantedAuthority> list = new ArrayList<>();
        list.add(new SimpleGrantedAuthority("ROLE_" + dr.getObj().getNombre()));
        return list;
    }

    @PermitAll
    @Nonnull
    public UserInfo getUserInfo() {
        Authentication auth = context.getAuthentication();
        final List<String> authorities = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        Integer userId = Integer.parseInt(auth.getCredentials().toString());
        return new UserInfo(auth.getName(), authorities, userId);
    }

    public record UserInfo(
            @NonNull String name,
            @NonNull Collection<String> authorities,
            @NonNull Integer id) {
    }

    public ResponseEntity<Map<String, String>> login(String correo, String clave) {
        Map<String, String> out = new HashMap<>();
        try {
            // Debug - agregar logs
            System.out.println("=== LOGIN DEBUG ===");
            System.out.println("Correo recibido: " + correo);
            System.out.println("Clave recibida: " + clave);

            // Verificar que los parámetros no sean null
            if (correo == null || clave == null) {
                out.put("message", "Correo y clave son requeridos");
                out.put("estado", "false");
                return ResponseEntity.ok(out);
            }

            // Cargar datos y verificar
            dc.setObj(new Cuenta());
            List<Cuenta> cuentas = dc.listAll().toList();
            System.out.println("Total cuentas en DB: " + cuentas.size());

            // Buscar cuenta
            Cuenta cuentaEncontrada = null;
            for (Cuenta cuenta : cuentas) {
                System.out.println("Comparando con cuenta ID: " + cuenta.getId() +
                        ", Correo: " + cuenta.getCorreo() +
                        ", Clave: " + cuenta.getClave());

                if (cuenta.getCorreo() != null && cuenta.getCorreo().equals(correo) &&
                        cuenta.getClave() != null && cuenta.getClave().equals(clave)) {
                    cuentaEncontrada = cuenta;
                    break;
                }
            }

            if (cuentaEncontrada != null) {
                // Login exitoso
                System.out.println("Login exitoso para cuenta ID: " + cuentaEncontrada.getId());

                // Crear authorities
                Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

                // Crear Authentication
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(correo,
                        null, authorities);

                // Establecer en SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);

                out.put("message", "Inicio de sesión exitoso");
                out.put("estado", "true");
                out.put("correo", cuentaEncontrada.getCorreo());
                out.put("id", cuentaEncontrada.getId().toString());
            } else {
                System.out.println("Credenciales incorrectas");
                out.put("message", "Su clave o usuario son incorrectos");
                out.put("estado", "false");
            }

        } catch (Exception e) {
            System.err.println("Error en login: " + e.getMessage());
            e.printStackTrace();
            out.put("message", "Error interno del servidor");
            out.put("estado", "false");
        }

        return ResponseEntity.ok(out);
    }

    public HashMap<String, String> logout() {
        context.setAuthentication(null);
        HashMap<String, String> mapa = new HashMap<>();
        mapa.put("msg", "Logout exitoso");
        return mapa;
    }

    public void create(@NotEmpty String correo, @NotEmpty String clave) throws Exception {
        if (correo.trim().length() > 0 && clave.trim().length() > 0) {
            dc.getObj().setCorreo(correo);
            dc.getObj().setClave(clave);
            if (!dc.save())
                throw new Exception("No se pudo guardar los datos de la cuenta");
        }
    }

    public void update(Integer id, @NotEmpty String clave) throws Exception {
        if (id != null && id > 0 && clave.trim().length() > 0) {
            dc.setObj(dc.listAll().get(id - 1));
            dc.getObj().setClave(clave);
            if (!dc.save())
                throw new Exception("No se pudo modificar la clave de la cuenta");
        }
    }

    public List<HashMap> ordenar(String atributo, Integer type) throws Exception {
        return Arrays.asList(dc.ordenarAtributo(dc.all(), atributo, type).toArray());
    }

    public List<HashMap> buscar(String attribute, String text, Integer type) throws Exception {
        LinkedList<HashMap<String, String>> lista = Utiles.busquedaLineal(dc.all(), attribute, text, type);
        if (!lista.isEmpty()) {
            return Arrays.asList(lista.toArray());
        } else {
            return new ArrayList<>();
        }
    }

    public List<HashMap> listCuenta() throws Exception {
        return Arrays.asList(dc.all().toArray());
    }

    public static void main(String[] args) {
        try {
            CuentaService cuentaService = new CuentaService();
            cuentaService.createRoles();
            cuentaService.createUsuarios();
            HashMap<String, Object> loginResponse = cuentaService.login("admin@gmail.com", "12345");
            if (loginResponse.get("estado").equals("true")) {
                System.out.println("Login successful: " + loginResponse);

                // Prueba getUserInfo
                UserInfo userInfo = cuentaService.getUserInfo();
                System.out.println("getUserInfo() devuelve:");
                System.out.println("  name: " + userInfo.name());
                System.out.println("  authorities: " + userInfo.authorities());

                // Prueba el mapa de login
                System.out.println("login() devuelve:");
                System.out.println("  name: " + loginResponse.get("name"));
                System.out.println("  authorities: " + loginResponse.get("authorities"));

                // Prueba getAuthentication
                Authentication auth = cuentaService.getAuthentication();
                if (auth != null) {
                    System.out.println("getAuthentication() devuelve: " + auth.getName());
                    System.out.println("Authorities (roles) del usuario:");
                    auth.getAuthorities().forEach(a -> System.out.println(" - " + a.getAuthority()));
                } else {
                    System.out.println("getAuthentication() devuelve null");
                }

            } else {
                System.out.println("Login failed: " + loginResponse.get("message"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
