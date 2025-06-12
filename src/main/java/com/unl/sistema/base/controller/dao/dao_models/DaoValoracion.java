package com.unl.sistema.base.controller.dao.dao_models;

import com.unl.sistema.base.controller.dao.AdapterDao;

import com.unl.sistema.base.models.Valoracion;

public class DaoValoracion extends AdapterDao<Valoracion>{
    private Valoracion obj;

    public DaoValoracion(){
        super(Valoracion.class);
    }
    
    public Valoracion getObj() {
        if (obj == null)
            this.obj = new Valoracion();
        return this.obj;
    }
    
    public void setObj(Valoracion obj) {
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
}