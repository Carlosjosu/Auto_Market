package com.unl.sistema.base.controller.services;

import java.util.List;
import org.springframework.stereotype.Service;
import com.unl.sistema.base.controller.dao.dao_models.DaoConversacion;
import com.unl.sistema.base.models.Conversacion;

@Service
public class ConversacionService {
    private final DaoConversacion daoConversacion = new DaoConversacion();

    public void agregarConversacion(Conversacion conversacion) throws Exception {
        daoConversacion.addConversacion(conversacion);
    }

    public Conversacion buscarConversacion(Integer idEmisor, Integer idReceptor) {
        return daoConversacion.findConversacion(idEmisor, idReceptor);
    }

    public List<Conversacion> obtenerConversacionesPorUsuario(Integer usuarioId) {
        return daoConversacion.getConversacionesPorUsuario(usuarioId);
    }
}