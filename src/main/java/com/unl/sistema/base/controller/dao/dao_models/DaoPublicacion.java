package com.unl.sistema.base.controller.dao.dao_models;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.models.Publicacion;

public class DaoPublicacion extends AdapterDao<Publicacion> {
    private Publicacion obj;

    public DaoPublicacion() {
        super(Publicacion.class);
    }

    public Publicacion getObj() {
        if (obj == null)
            this.obj = new Publicacion();
        return this.obj;
    }

    public void setObj(Publicacion obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength() + 1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            // Log de error
            e.printStackTrace();
            System.out.println(e);
            return false;
        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            // Log de error
            return false;
        }
    }
}