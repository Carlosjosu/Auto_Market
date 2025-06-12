package com.unl.sistema.base.controller.dao.dao_models;

import java.util.ArrayList;
import java.util.List;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.models.Mensaje;
import org.springframework.stereotype.Repository;

@Repository
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
    public List<Mensaje> findByConversacionId(Long conversacionId) {
        List<Mensaje> result = new ArrayList<>();
        for (Mensaje m : new ArrayList<Mensaje>(listAll())) {
            if (m.getIdConversacion() != null && m.getIdConversacion().longValue() == conversacionId) {
                result.add(m);
            }
        }
        return result;
    }

    public Mensaje save(Mensaje mensaje) throws Exception {
        mensaje.setId(listAll().getLength() + 1);
        this.persist(mensaje);
        return mensaje;
    }
}