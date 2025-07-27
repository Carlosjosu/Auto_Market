package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

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

        return new UserInfo(auth.getName(), authorities);
    }

    public record UserInfo(
            @NonNull String name,
            @NonNull Collection<String> authorities) {
    }

    /**
     * Obtiene el ID del usuario actual logueado
     */
    public Integer getUserId() {
        Authentication auth = context.getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            try {
                // El password contiene el ID de la cuenta
                String accountId = auth.getCredentials().toString();

                // Buscar el usuario por ID de cuenta
                DaoUsuario du = new DaoUsuario();
                for (int i = 0; i < du.listAll().getLength(); i++) {
                    if (du.listAll().get(i).getIdCuenta().toString().equals(accountId)) {
                        return du.listAll().get(i).getId();
                    }
                }
            } catch (Exception e) {
                System.err.println("Error obteniendo ID del usuario: " + e.getMessage());
            }
        }
        return null;
    }

    /**
     * Obtiene la información completa del usuario actual
     */
    public HashMap<String, Object> getCurrentUserInfo() {
        HashMap<String, Object> result = new HashMap<>();
        Authentication auth = context.getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            try {
                String accountId = auth.getCredentials().toString();
                DaoUsuario du = new DaoUsuario();

                for (int i = 0; i < du.listAll().getLength(); i++) {
                    if (du.listAll().get(i).getIdCuenta().toString().equals(accountId)) {
                        var usuario = du.listAll().get(i);
                        result.put("id", usuario.getId());
                        result.put("nickname", usuario.getNickname());
                        result.put("nombre", usuario.getNombre());
                        result.put("apellido", usuario.getApellido());
                        result.put("idRol", usuario.getIdRol());
                        result.put("idCuenta", usuario.getIdCuenta());

                        // Obtener rol
                        DaoRol dr = new DaoRol();
                        if (usuario.getIdRol() != null && usuario.getIdRol() > 0) {
                            var rol = dr.get(usuario.getIdRol() - 1);
                            if (rol != null) {
                                result.put("rol", rol.getNombre());
                            }
                        }
                        break;
                    }
                }
            } catch (Exception e) {
                System.err.println("Error obteniendo información del usuario: " + e.getMessage());
            }
        }

        return result;
    }

    /**
     * Verifica si el usuario actual es administrador
     */
    public Boolean isCurrentUserAdmin() {
        Authentication auth = context.getAuthentication();

        if (auth != null && auth.isAuthenticated()) {
            // Verificar por authorities (más seguro)
            boolean hasAdminRole = auth.getAuthorities().stream()
                    .anyMatch(authority -> authority.getAuthority().equals("ROLE_admin"));

            if (hasAdminRole) {
                return true;
            }

            // Verificación adicional por información del usuario
            try {
                HashMap<String, Object> userInfo = getCurrentUserInfo();
                String rol = (String) userInfo.get("rol");
                return "admin".equals(rol);
            } catch (Exception e) {
                System.err.println("Error verificando rol de administrador: " + e.getMessage());
            }
        }

        return false;
    }

    public HashMap<String, Object> login(String email, String password) throws Exception {
        HashMap<String, Object> mapa = new HashMap<>();
        try {
            HashMap<String, Object> aux = dc.login(email, password);
            if (aux != null) {
                context.setAuthentication(new UsernamePasswordAuthenticationToken(
                        aux.get("usuario").toString(), aux.get("id").toString(), getAuthorities(aux)));
            }
            Authentication auth = context.getAuthentication();
            final List<String> authorities = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();
            mapa.put("name", auth.getName());
            mapa.put("authorities", authorities);
            mapa.put("message", "OK");
            mapa.put("estado", "true");
        } catch (Exception e) {
            mapa.put("user", new HashMap<>());
            mapa.put("message", "Credenciales incorrectas");
            mapa.put("estado", "false");
            context.setAuthentication(null);
            System.out.println(e);
        }
        return mapa;
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