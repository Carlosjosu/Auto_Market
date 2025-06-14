package com.unl.sistema.base.controller.dao.dao_models;

import java.util.HashMap;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
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

    public LinkedList<HashMap<String,String>> all() {
        LinkedList<HashMap<String,String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Usuario[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String,String> toDict(Usuario arreglo) {
        HashMap<String,String> aux = new HashMap<>();
        aux.put("id", arreglo.getId().toString());
        aux.put("nickname", arreglo.getNickname());
        aux.put("nombre", arreglo.getNombre());
        aux.put("apellido", arreglo.getApellido());
        aux.put("cedula", arreglo.getCedula());
        aux.put("telefono", arreglo.getTelefono());
        aux.put("idCuenta", new DaoCuenta().listAll().get(arreglo.getIdCuenta() - 1).getCorreo());
        return aux;
    }
}