package com.unl.sistema.base.controller.dao.dao_models;

import java.util.List;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.models.Conversacion;
import org.springframework.stereotype.Repository;

@Repository

public class DaoConversacion extends AdapterDao<Conversacion>{
    private Conversacion obj;

    public DaoConversacion(){
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
            obj.setId(listAll().getLength()+1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            //Log de error
            e.printStackTrace();
            System.out.println(e);
            return false;
            // TODO: handle exception
        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj,pos);
            return true;
        } catch (Exception e) {
            //Log de error
            return false;
            // TODO: handle exception
        }
    }

    public List<Conversacion> findByUsuarioId(Long usuarioId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByUsuarioId'");
    }

    public Conversacion save(Conversacion nuevaConversacion) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public Conversacion findById(Long conversacionId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findById'");
    }
}