package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.dao_models.DaoCuenta;
import com.unl.sistema.base.controller.dao.dao_models.DaoRol;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Cuenta;
import com.unl.sistema.base.models.Rol;
import com.unl.sistema.base.models.Usuario;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed

public class UsuarioService {

    private DaoUsuario du;

    public UsuarioService() {
        du = new DaoUsuario();
    }

    public void create(@NotEmpty String nickname, @NotEmpty String nombre, @NotEmpty String apellido,
            @NotEmpty String cedula, @NotEmpty String telefono, Integer idCuenta, Integer idRol) throws Exception {
        if (nickname.trim().length() > 0 && nombre.trim().length() > 0 && apellido.trim().length() > 0
                && cedula.trim().length() > 0
                && telefono.trim().length() > 0 && idCuenta > 0 && idRol > 0) {
            LinkedList<HashMap<String, String>> resultado = Utiles.busquedaLineal(du.all(), "nickname", nickname, 0);
            if (!resultado.isEmpty()) {
                throw new Exception("El nickname ya está registrado");
            }
            du.getObj().setNickname(nickname);
            du.getObj().setNombre(nombre);
            du.getObj().setApellido(apellido);
            du.getObj().setCedula(cedula);
            du.getObj().setTelefono(telefono);
            du.getObj().setIdCuenta(idCuenta);
            du.getObj().setIdRol(idRol);
            if (!du.save())
                throw new Exception("No se pudo guardar los datos del usuario");
        }
    }

    public void update(Integer id, @NotEmpty String nickname, @NotEmpty String telefono) throws Exception {
        if (id != null && id > 0 && nickname.trim().length() > 0 && telefono.trim().length() > 0) {
            du.setObj(du.listAll().get(id - 1));
            LinkedList<HashMap<String, String>> resultado = Utiles.busquedaLineal(du.all(), "nickname", nickname, 0);
            if (!resultado.isEmpty() && !du.getObj().getNickname().equals(nickname)) {
                throw new Exception("El nickname ya está registrado");
            }
            du.getObj().setNickname(nickname);
            du.getObj().setTelefono(telefono);
            if (!du.update(id - 1))
                throw new Exception("No se pudo modificar los datos del usuario");
        }
    }

    public List<HashMap> listaCuenta() {
        List<HashMap> lista = new ArrayList<>();
        DaoCuenta db = new DaoCuenta();
        if (!db.listAll().isEmpty()) {
            Cuenta[] arreglo = db.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getCorreo());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> listaRol() {
        List<HashMap> lista = new ArrayList<>();
        DaoRol dr = new DaoRol();
        if (!dr.listAll().isEmpty()) {
            Rol[] arreglo = dr.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> ordenar(String atributo, Integer type) {
        return Arrays.asList(du.ordenarAtributo(du.all(), atributo, type).toArray());
    }

    public List<HashMap> buscar(String attribute, String text, Integer type) throws Exception {
        LinkedList<HashMap<String, String>> lista = Utiles.busquedaLineal(du.all(), attribute, text, type);
        if (!lista.isEmpty()) {
            return Arrays.asList(lista.toArray());
        } else {
            return new ArrayList<>();
        }
    }

    public List<HashMap> listUsuario() {
        return Arrays.asList(du.all().toArray());
    }

    // Método para obtener un usuario específico por ID (requerido por
    // MensajeView.tsx)
    public HashMap<String, String> getUsuario(Integer id) throws Exception {
        if (id == null || id <= 0) {
            throw new Exception("ID de usuario inválido");
        }

        try {
            // Usar el método findById del DAO
            Usuario usuario = du.findById(id);
            if (usuario != null) {
                return toSafeDict(usuario);
            }

            throw new Exception("Usuario no encontrado con ID: " + id);
        } catch (Exception e) {
            System.err.println("Error obteniendo usuario con ID " + id + ": " + e.getMessage());
            throw new Exception("Error al obtener usuario: " + e.getMessage());
        }
    }

    // Método auxiliar para convertir Usuario a HashMap de forma segura
    private HashMap<String, String> toSafeDict(Usuario usuario) {
        HashMap<String, String> aux = new HashMap<>();
        try {
            aux.put("id", usuario.getId() != null ? usuario.getId().toString() : "0");
            aux.put("nickname", usuario.getNickname() != null ? usuario.getNickname() : "");
            aux.put("nombre", usuario.getNombre() != null ? usuario.getNombre() : "");
            aux.put("apellido", usuario.getApellido() != null ? usuario.getApellido() : "");
            aux.put("cedula", usuario.getCedula() != null ? usuario.getCedula() : "");
            aux.put("telefono", usuario.getTelefono() != null ? usuario.getTelefono() : "");
            aux.put("idCuenta", usuario.getIdCuenta() != null ? usuario.getIdCuenta().toString() : "0");
            aux.put("idRol", usuario.getIdRol() != null ? usuario.getIdRol().toString() : "0");

            // Intentar obtener el correo de forma segura
            try {
                if (usuario.getIdCuenta() != null && usuario.getIdCuenta() > 0) {
                    DaoCuenta dc = new DaoCuenta();
                    if (!dc.listAll().isEmpty() && dc.listAll().getLength() >= usuario.getIdCuenta()) {
                        Cuenta cuenta = dc.listAll().get(usuario.getIdCuenta() - 1);
                        if (cuenta != null && cuenta.getCorreo() != null) {
                            aux.put("correo", cuenta.getCorreo());
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error obteniendo correo para usuario " + usuario.getId() + ": " + e.getMessage());
                aux.put("correo", "sin-correo@example.com");
            }

            // Si no se pudo obtener correo, poner valor por defecto
            if (!aux.containsKey("correo")) {
                aux.put("correo", "sin-correo@example.com");
            }

        } catch (Exception e) {
            System.err.println("Error convirtiendo usuario a HashMap: " + e.getMessage());
        }
        return aux;
    }

    // Método para buscar usuario por nickname (útil para el chat)
    public HashMap<String, String> getUsuarioPorNickname(String nickname) throws Exception {
        if (nickname == null || nickname.trim().isEmpty()) {
            throw new Exception("Nickname inválido");
        }

        try {
            LinkedList<HashMap<String, String>> resultado = Utiles.busquedaLineal(du.all(), "nickname", nickname, 0);
            if (!resultado.isEmpty()) {
                return resultado.get(0);
            }
            throw new Exception("Usuario no encontrado con nickname: " + nickname);
        } catch (Exception e) {
            System.err.println("Error buscando usuario por nickname " + nickname + ": " + e.getMessage());
            throw new Exception("Error al buscar usuario: " + e.getMessage());
        }
    }

    // Método para obtener usuarios conectados (para el grafo de chat)
    public List<HashMap> getUsuariosConectados(Integer usuarioId) {
        List<HashMap> usuariosConectados = new ArrayList<>();
        try {
            if (usuarioId == null || usuarioId <= 0) {
                return usuariosConectados;
            }

            // Por ahora retorna todos los usuarios activos (excepto el actual)
            // En una implementación real, esto estaría conectado con el grafo de
            // conversaciones
            LinkedList<HashMap<String, String>> todosUsuarios = du.all();
            for (int i = 0; i < todosUsuarios.getLength(); i++) {
                HashMap<String, String> usuario = todosUsuarios.get(i);
                if (usuario.get("id") != null && !usuario.get("id").equals(usuarioId.toString())) {
                    usuariosConectados.add(usuario);
                }
            }
        } catch (Exception e) {
            System.err.println("Error obteniendo usuarios conectados: " + e.getMessage());
        }
        return usuariosConectados;
    }

    // Método para verificar si un usuario existe
    public boolean existeUsuario(Integer id) {
        try {
            getUsuario(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Método para obtener usuarios activos para el chat
    public List<HashMap> getUsuariosActivos() {
        List<HashMap> usuariosActivos = new ArrayList<>();
        try {
            LinkedList<HashMap<String, String>> todosUsuarios = du.all();
            for (int i = 0; i < todosUsuarios.getLength(); i++) {
                HashMap<String, String> usuario = todosUsuarios.get(i);
                // Agregar todos los usuarios (en una implementación real podrías filtrar por
                // estado activo)
                usuariosActivos.add(usuario);
            }
        } catch (Exception e) {
            System.err.println("Error obteniendo usuarios activos: " + e.getMessage());
        }
        return usuariosActivos;
    }

    // Método para obtener estadísticas de usuarios (para el dashboard del chat)
    public HashMap<String, Object> getEstadisticasUsuarios() {
        HashMap<String, Object> estadisticas = new HashMap<>();
        try {
            LinkedList<HashMap<String, String>> todosUsuarios = du.all();
            estadisticas.put("totalUsuarios", todosUsuarios.getLength());
            estadisticas.put("usuariosActivos", todosUsuarios.getLength()); // Simplificado

            // Contar usuarios por rol si es necesario
            int adminCount = 0;
            int userCount = 0;
            for (int i = 0; i < todosUsuarios.getLength(); i++) {
                HashMap<String, String> usuario = todosUsuarios.get(i);
                String idRol = usuario.get("idRol");
                if ("1".equals(idRol)) {
                    adminCount++;
                } else if ("2".equals(idRol)) {
                    userCount++;
                }
            }
            estadisticas.put("administradores", adminCount);
            estadisticas.put("usuariosRegulares", userCount);

        } catch (Exception e) {
            System.err.println("Error obteniendo estadísticas de usuarios: " + e.getMessage());
            estadisticas.put("error", e.getMessage());
        }
        return estadisticas;
    }

}