package com.unl.sistema.base.controller.dao.dao_models;

import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.controller.dao.AdapterDao;

import com.unl.sistema.base.models.Usuario;

public class DaoUsuario extends AdapterDao<Usuario>{
    private Usuario obj;

    public DaoUsuario(){
        super(Usuario.class);
    }
    
    public Usuario getObj() {
        if (obj == null)
            this.obj = new Usuario();
        return this.obj;
    }
    
    public void setObj(Usuario obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength()+1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
            return false;
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

    public Boolean saveUsuario(Usuario usuario) {
        setObj(usuario);
        return save();
    }

    public LinkedList<Usuario> listUsuarios(org.springframework.data.domain.Pageable pageable) {
        // Si tienes paginación, implementa aquí la lógica. Por ahora retorna todos.
        return listAll();
    }
}
