package com.unl.sistema.base.controller.dao.dao_models;

import java.util.HashMap;
import java.lang.reflect.Field;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Cuenta;

public class DaoCuenta extends AdapterDao<Cuenta> {
    private Cuenta obj;

    public DaoCuenta() {
        super(Cuenta.class);
    }

    public Cuenta getObj() {
        if (obj == null)
            this.obj = new Cuenta();
        return this.obj;
    }

    public void setObj(Cuenta obj) {
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

    public HashMap<String, Object> toDict(Cuenta c) throws Exception {
        HashMap<String, Object> map = new HashMap<>();
        DaoUsuario du = new DaoUsuario();
        du.setObj(du.get(c.getId()));
        map.put("correo", c.getCorreo());
        map.put("id", c.getId());
        map.put("usuario", du.getObj().getNickname());
        return map;
    }

    private HashMap<String, Object> toDictPassword(Cuenta c) throws Exception {
        HashMap<String, Object> map = new HashMap<>();
        DaoUsuario du = new DaoUsuario();
        du.setObj(du.get(c.getId()));
        map.put("correo", c.getCorreo());
        map.put("id", c.getId());
        map.put("clave", c.getClave());
        map.put("usuario", du.getObj().getNickname());
        return map;
    }

    private LinkedList<HashMap<String, Object>> listPrivate() throws Exception {
        LinkedList<HashMap<String, Object>> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {
            Cuenta[] aux = listAll().toArray();
            for (Cuenta c : aux) {
                lista.add(toDictPassword(c));
            }
        }
        return lista;
    }

    public HashMap<String, Object> login(String email, String password) throws Exception {
        if (!listAll().isEmpty()) {
            HashMap<String, Object>[] arreglo = listPrivate().toArray();
            quickSort(arreglo, 0, arreglo.length - 1, "correo");
            HashMap<String, Object> search = buscarAtributo(arreglo, 0, arreglo.length - 1, "correo", email);
            if (search != null) {
                if (search.get("clave").toString().equals(password)) {
                    return toDict(get((Integer) search.get("id")));
                } else
                    throw new Exception("Su clave o usuario son incorrectos");
            } else
                throw new Exception("No se encontro la cuenta");
        } else
            return null;
    }

    public static void main(String[] args) {
        try {
            DaoCuenta dc = new DaoCuenta();
            HashMap mapa = dc.login("maria.garcia@gmail.com", "maria456");
            if(mapa != null) {
                System.out.println(mapa.get("usuario"));
            }
        } catch (Exception ex) {
            System.out.println("Hubo un error "+ex);
            ex.printStackTrace();
        }
    }

}