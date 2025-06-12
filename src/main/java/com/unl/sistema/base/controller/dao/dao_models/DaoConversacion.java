package com.unl.sistema.base.controller.dao.dao_models;

import java.util.ArrayList;
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

    public Boolean save() {
        try {
            obj.setId(listAll().getLength() + 1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Implementación funcional
    public List<Conversacion> findByUsuarioId(Long usuarioId) {
        List<Conversacion> result = new ArrayList<>();
        for (Conversacion c : new ArrayList<Conversacion>(listAll())) {
            if (c.getIdEmisor() != null && c.getIdEmisor().longValue() == usuarioId) {
                result.add(c);
            } else if (c.getIdReceptor() != null && c.getIdReceptor().longValue() == usuarioId) {
                result.add(c);
            }
        }
        return result;
    }

    public Conversacion save(Conversacion nuevaConversacion) throws Exception {
        nuevaConversacion.setId(listAll().getLength() + 1);
        nuevaConversacion.setFechaInicio(new Date());
        this.persist(nuevaConversacion);
        return nuevaConversacion;
    }

    public Conversacion findById(Long conversacionId) {
        for (Conversacion c : new ArrayList<>(listAll())) {
            if (c.getId() != null && c.getId().longValue() == conversacionId) {
                return c;
            }
        }
        return null;
    }
}