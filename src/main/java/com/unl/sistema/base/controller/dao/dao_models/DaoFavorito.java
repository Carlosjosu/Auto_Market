package com.unl.sistema.base.controller.dao.dao_models;

import com.unl.sistema.base.controller.dao.AdapterDao;

import com.unl.sistema.base.models.Favorito;

public class DaoFavorito extends AdapterDao<Favorito>{
    private Favorito obj;

    public DaoFavorito(){
        super(Favorito.class);
    }
    
    public Favorito getObj() {
        if (obj == null)
            this.obj = new Favorito();
        return this.obj;
    }
    
    public void setObj(Favorito obj) {
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