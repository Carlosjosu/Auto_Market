package com.unl.sistema.base.controller.dao.dao_models;

import java.util.Date;
import java.util.List;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.models.Mensaje;
import org.springframework.stereotype.Component;

@Component
public class DaoMensaje extends AdapterDao<Mensaje> {
    private Mensaje obj;

    public DaoMensaje() {
        super(Mensaje.class);
    }

    public Mensaje getObj() {
        if (obj == null)
            this.obj = new Mensaje();
        return this.obj;
    }

    public void setObj(Mensaje obj) {
        this.obj = obj;
    }

    // Agrega mensaje (FIFO)
    public void addMensaje(Mensaje mensaje) throws Exception {
        mensaje.setId(getAllAsList().size() + 1);
        mensaje.setFechaEnvio(new Date());
        addFIFO(mensaje);
    }

    // Obtiene mensajes por idConversacion (FIFO)
    public List<Mensaje> getMensajesPorConversacion(Integer idConversacion) {
        return filter(m -> m.getIdConversacion().equals(idConversacion));
    }
}