package com.unl.sistema.base.controller;

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
        return usuarioDao.findAll(); // Esto lee Usuario.json usando tu AdapterDao
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
    }
}