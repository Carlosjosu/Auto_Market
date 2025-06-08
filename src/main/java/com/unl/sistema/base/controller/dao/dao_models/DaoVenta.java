package com.unl.sistema.base.controller.dao.dao_models;

import java.util.Date;

import com.unl.sistema.base.controller.dao.AdapterDao;

import com.unl.sistema.base.models.Venta;

public class DaoVenta extends AdapterDao<Venta> {
    private Venta obj;

    public DaoVenta() {
        super(Venta.class);
    }

    public Venta getObj() {
        if (obj == null)
            this.obj = new Venta();
        return this.obj;

    }

    public void setObj(Venta obj) {
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
            // TODO: handle exception
        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            // Log de error
            return false;
            // TODO: handle exception
        }
    }
    public Boolean delete(Integer pos) {
        try {
            this.delete(pos);
            return true;
        } catch (Exception e) {
            // Log de error
            return false;
        }
    }
    

}