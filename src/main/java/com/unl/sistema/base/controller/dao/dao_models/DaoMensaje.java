package com.unl.sistema.base.controller.dao.dao_models;

import java.util.ArrayList;
import java.util.List;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.models.Mensaje;
import org.springframework.stereotype.Repository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class DaoMensaje extends AdapterDao<Mensaje> {
    private static final Logger logger = LoggerFactory.getLogger(DaoMensaje.class);
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
            // Implement your save logic here, for example:
            this.persist(obj);
            return true;
        } catch (Exception e) {
            logger.error("Error saving Mensaje", e);
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
        for (Mensaje m : (Iterable<Mensaje>) listAll()) {
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

    @Override
    public com.unl.sistema.base.controller.datastruct.list.LinkedList<Mensaje> findAllByField(String fieldName, Object value) {
        com.unl.sistema.base.controller.datastruct.list.LinkedList<Mensaje> result = new com.unl.sistema.base.controller.datastruct.list.LinkedList<>();
        for (Mensaje m : (Iterable<Mensaje>) listAll()) {
            if (fieldName.equals("idConversacion") && m.getIdConversacion() != null && m.getIdConversacion().equals(value)) {
                result.add(m);
            }
        }
        return result;
    }

    @Override
    public void add(Mensaje nuevoMensaje) throws Exception {
        this.persist(nuevoMensaje);
    }
}