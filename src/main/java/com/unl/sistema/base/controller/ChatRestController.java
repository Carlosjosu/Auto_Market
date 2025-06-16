package com.unl.sistema.base.controller;

<<<<<<< HEAD
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.controller.dao.dao_models.DaoConversacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.models.Usuario;
import com.unl.sistema.base.models.Conversacion;
import com.unl.sistema.base.models.Mensaje;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ChatRestController {

    @Autowired
    private DaoUsuario usuarioDao;

    @Autowired
    private DaoConversacion conversacionDao;

    @Autowired
    private DaoMensaje mensajeDao;

    // USUARIOS
    @GetMapping("/usuarios")
    public List<Usuario> getUsuarios() {
        return usuarioDao.findAll(); // Esto debe devolver una lista de objetos Usuario
    }

    @GetMapping("/usuarios/{id}")
    public Usuario getUsuario(@PathVariable Long id) {
        return usuarioDao.findById(id);
    }

    @PostMapping("/usuarios")
    public Usuario crearUsuario(@RequestBody Usuario usuario) throws Exception {
        usuario.setId(usuarioDao.listAll().getLength() + 1);
        usuarioDao.persist(usuario);
        return usuario;
    }

    // CONVERSACIONES
    @GetMapping("/conversaciones")
    public List<Conversacion> getConversaciones(@RequestParam Long usuarioId) {
        return conversacionDao.findByUsuarioId(usuarioId);
    }

    @GetMapping("/conversaciones/{id}")
    public Conversacion getConversacion(@PathVariable Long id) {
        return conversacionDao.findById(id);
    }

    @PostMapping("/conversaciones")
    public Conversacion crearConversacion(@RequestBody Conversacion conversacion) throws Exception {
        conversacion.setId(conversacionDao.listAll().getLength() + 1);
        conversacionDao.persist(conversacion);
        return conversacion;
    }

    // MENSAJES
    @GetMapping("/mensajes")
    public List<Mensaje> getMensajes(@RequestParam Long conversacionId) {
        return mensajeDao.findByConversacionId(conversacionId);
    }

    @PostMapping("/mensajes")
    public Mensaje crearMensaje(@RequestBody Mensaje mensaje) throws Exception {
        mensaje.setId(mensajeDao.listAll().getLength() + 1);
        mensajeDao.persist(mensaje);
        return mensaje;
=======
import com.unl.sistema.base.controller.dao.dao_models.DaoConversacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.models.Conversacion;
import com.unl.sistema.base.models.Mensaje;
import com.unl.sistema.base.models.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    @Autowired
    private DaoMensaje daoMensaje;
    @Autowired
    private DaoConversacion daoConversacion;
    @Autowired
    private DaoUsuario daoUsuario;

    // Obtener mensajes de una conversación
    @GetMapping("/mensajes")
    public List<Mensaje> getMensajes(@RequestParam Long conversacionId) {
        return daoMensaje.findByConversacionId(conversacionId);
    }

    // Enviar mensaje
    @PostMapping("/mensajes")
    public Mensaje enviarMensaje(@RequestBody Mensaje mensaje) throws Exception {
        return daoMensaje.save(mensaje);
    }

    // Obtener conversaciones de un usuario
    @GetMapping("/conversaciones")
    public List<Conversacion> getConversaciones(@RequestParam Long usuarioId) {
        return daoConversacion.findByUsuarioId(usuarioId);
    }

    // Obtener usuario por id
    @GetMapping("/usuario")
    public Usuario getUsuario(@RequestParam Long usuarioId) {
        return daoUsuario.findById(usuarioId);
>>>>>>> origin/feature/Tayron_ModuloMensajes
    }
}