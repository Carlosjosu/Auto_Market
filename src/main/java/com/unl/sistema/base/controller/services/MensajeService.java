package com.unl.sistema.base.controller.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.models.Mensaje;

@Service
public class MensajeService {
    private final DaoMensaje daoMensaje = new DaoMensaje();

    public void agregarMensaje(Mensaje mensaje) throws Exception {
        daoMensaje.addMensaje(mensaje);
    }

    public List<Mensaje> obtenerMensajesPorConversacion(Integer idConversacion) {
        return daoMensaje.getMensajesPorConversacion(idConversacion);
    }
}