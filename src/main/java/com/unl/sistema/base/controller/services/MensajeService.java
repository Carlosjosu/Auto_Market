package com.unl.sistema.base.controller.services;

import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.models.Mensaje;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public class MensajeService {
    private final DaoMensaje mensajeDao;

    public MensajeService(DaoMensaje mensajeDao) {
        this.mensajeDao = mensajeDao;
    }

    public List<Mensaje> obtenerMensajesConversacion(Long conversacionId) {
        return mensajeDao.findByConversacionId(conversacionId);
    }

    public Mensaje enviarMensaje(Mensaje mensaje) throws Exception {
        return mensajeDao.save(mensaje);
    }

    @GetMapping("/mensajes")
    public ResponseEntity<List<Mensaje>> getMensajes(@RequestParam Long conversacionId) {
        List<Mensaje> mensajes = mensajeDao.findByConversacionId(conversacionId);
        return ResponseEntity.ok(mensajes);
    }
}