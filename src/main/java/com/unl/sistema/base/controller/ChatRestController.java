package com.unl.sistema.base.controller;

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
    }
}