package com.unl.sistema.base.controller.dao.dao_models;

import com.unl.sistema.base.controller.dao.AdapterDao;

import com.unl.sistema.base.models.Imagen;

public class DaoImagen extends AdapterDao<Imagen> {
    private Imagen obj;

    public DaoImagen() {
        super(Imagen.class);
    }

    public Imagen getObj() {
        if (obj == null)
            this.obj = new Imagen();
        return this.obj;
    }

    public void setObj(Imagen obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            System.out.println("Entrando a save() de DaoImagen");
            obj.setId(listAll().getLength() + 1);
            System.out.println("Guardando imagen: " + obj);
            this.persist(obj);
            System.out.println("Imagen guardada en persistencia");
            return true;
        } catch (Exception e) {
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

            return false;

        }
    }

}
