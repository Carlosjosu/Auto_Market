package com.unl.sistema.base.controller.dao.dao_models;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.models.Usuario;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class DaoUsuario extends AdapterDao<Usuario> {
    private Usuario obj;

    public DaoUsuario() {
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
    public Usuario findById(Long usuarioId) {
        List<Usuario> usuarios = (List<Usuario>) listAll();
        for (Usuario u : usuarios) {
            if (u.getId() != null && u.getId().longValue() == usuarioId) {
                return u;
            }
        }
        return null;
    }
}