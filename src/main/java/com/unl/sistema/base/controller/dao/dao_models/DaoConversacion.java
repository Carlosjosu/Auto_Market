package com.unl.sistema.base.controller.dao.dao_models;

import java.util.Date;
import java.util.List;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.models.Conversacion;
import org.springframework.stereotype.Repository;

@Repository
public class DaoConversacion extends AdapterDao<Conversacion> {
    private Conversacion obj;

    public DaoConversacion() {
        super(Conversacion.class);
    }

    public Conversacion getObj() {
        if (obj == null)
            this.obj = new Conversacion();
        return this.obj;
    }

    public void setObj(Conversacion obj) {
        this.obj = obj;
    }

    // Agrega conversación (FIFO)
    public void addConversacion(Conversacion conversacion) throws Exception {
        conversacion.setId(getAllAsList().size() + 1);
        conversacion.setFechaInicio(new Date());
        addFIFO(conversacion);
    }

    // Busca conversación entre dos usuarios
    public Conversacion findConversacion(Integer idEmisor, Integer idReceptor) {
        return getAllAsList().stream()
            .filter(c -> (c.getIdEmisor().equals(idEmisor) && c.getIdReceptor().equals(idReceptor)) ||
                         (c.getIdEmisor().equals(idReceptor) && c.getIdReceptor().equals(idEmisor)))
            .findFirst().orElse(null);
    }

    // Obtiene todas las conversaciones de un usuario
    public List<Conversacion> getConversacionesPorUsuario(Integer usuarioId) {
        return filter(c -> c.getIdEmisor().equals(usuarioId) || c.getIdReceptor().equals(usuarioId));
    }
}