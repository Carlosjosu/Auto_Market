package com.unl.sistema.base.controller.services;

import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.models.Mensaje;
import org.springframework.stereotype.Service;

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

    public Mensaje enviarMensaje(Mensaje mensaje) {
        return mensajeDao.save(mensaje);
    }
}