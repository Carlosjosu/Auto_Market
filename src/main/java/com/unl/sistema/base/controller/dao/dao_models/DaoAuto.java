package com.unl.sistema.base.controller.dao.dao_models;

import java.util.Date;

import com.unl.sistema.base.controller.dao.AdapterDao;

import com.unl.sistema.base.models.Auto;


public class DaoAuto extends AdapterDao<Auto>{
    private Auto obj;

    public DaoAuto(){
        super(Auto.class);
    }
    
    public Auto getObj() {
        if (obj == null)
            this.obj = new Auto();
        return this.obj;
    }
    
    public void setObj(Auto obj) {
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
