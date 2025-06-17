package com.unl.sistema.base.controller.services;

import com.unl.sistema.base.controller.dao.dao_models.DaoConversacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.models.Conversacion;
import com.unl.sistema.base.models.Mensaje;
import com.unl.sistema.base.models.Usuario;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@Service
public class ConversacionService {

    private final DaoConversacion conversacionDao;
    private final DaoMensaje mensajeDao;
    private final DaoUsuario usuarioDao;

    public ConversacionService(DaoConversacion conversacionDao, DaoMensaje mensajeDao, DaoUsuario usuarioDao) {
        this.conversacionDao = conversacionDao;
        this.mensajeDao = mensajeDao;
        this.usuarioDao = usuarioDao;
    }

    // Obtener todas las conversaciones de un usuario
    public List<Conversacion> obtenerConversacionesUsuario(Long usuarioId) {
        return conversacionDao.findByUsuarioId(usuarioId);
    }

    // Buscar conversación por ID
    public Conversacion buscarPorId(Long id) {
        return conversacionDao.findById(id);
    }

    // Crear una nueva conversación
    public Conversacion crearConversacion(Integer idEmisor, Integer idReceptor, Integer idAuto) throws Exception {
        Conversacion c = new Conversacion();
        c.setIdEmisor(idEmisor);
        c.setIdReceptor(idReceptor);
        c.setIdAuto(idAuto);
        c.setFechaInicio(new Date());
        c.setEstaActiva(true);
        return conversacionDao.save(c);
    }

    // Obtener o crear una conversación entre dos usuarios
    public Conversacion obtenerOCrearConversacion(Long idEmisor, Long idReceptor) throws Exception {
        List<Conversacion> todas = conversacionDao.findByUsuarioId(idEmisor);
        for (Conversacion c : todas) {
            if ((c.getIdEmisor().equals(idEmisor) && c.getIdReceptor().equals(idReceptor)) ||
                (c.getIdEmisor().equals(idReceptor) && c.getIdReceptor().equals(idEmisor))) {
                return c; // Ya existe
            }
        }
        // Si no existe, crearla
        Conversacion nueva = new Conversacion();
        nueva.setIdEmisor(idEmisor.intValue());
        nueva.setIdReceptor(idReceptor.intValue());
        nueva.setFechaInicio(new Date());
        nueva.setEstaActiva(true);
        return conversacionDao.save(nueva);
    }

    // Enviar mensaje en una conversación
    public Mensaje enviarMensaje(Long conversacionId, Long usuarioActualId, String contenido) throws Exception {
        Conversacion conversacion = conversacionDao.findById(conversacionId);
        Usuario remitente = usuarioDao.findById(usuarioActualId);

        Mensaje mensaje = new Mensaje();
        mensaje.setConversacion(conversacion);
        mensaje.setRemitente(remitente);
        mensaje.setContenido(contenido);
        mensaje.setFechaEnvio(new Date());

        return mensajeDao.save(mensaje);
    }

    // --- Endpoints REST sugeridos ---

    @GetMapping("/api/conversaciones")
    public List<Conversacion> getConversacionesUsuario(@RequestParam Long usuarioId) {
        return obtenerConversacionesUsuario(usuarioId);
    }

    @GetMapping("/api/conversaciones/{id}")
    public Conversacion getConversacion(@PathVariable Long id) {
        return buscarPorId(id);
    }

    @PostMapping("/api/conversaciones/obtenerOCrear")
    public ResponseEntity<Conversacion> getOrCreateConversacion(@RequestParam Long idEmisor, @RequestParam Long idReceptor) throws Exception {
        Conversacion conv = obtenerOCrearConversacion(idEmisor, idReceptor);
        return ResponseEntity.ok(conv);
    }

    @PostMapping("/api/conversaciones")
    public Conversacion crearConversacionRest(@RequestBody Conversacion c) throws Exception {
        return crearConversacion(c.getIdEmisor(), c.getIdReceptor(), c.getIdAuto());
    }
}