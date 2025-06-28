package com.unl.sistema.base.controller.dao.dao_models;

import java.sql.Date;
import java.util.HashMap;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Favorito;

public class DaoFavorito extends AdapterDao<Favorito> {
    private Favorito obj;

    public DaoFavorito() {
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

    public Boolean delete(Integer id) {
        try {
            System.out.println("Intentando eliminar favorito con id: " + id);
            LinkedList<Favorito> lista = this.listAll();
            for (int i = 0; i < lista.getLength(); i++) {
                Favorito fav = lista.get(i);
                System.out.println("Comparando con favorito id: " + fav.getId());
                if (fav.getId() != null && fav.getId().equals(id)) {
                    this.delete(fav); // Elimina el favorito encontrado
                    System.out.println("Favorito eliminado");
                    return true;
                }
            }
            System.out.println("No se encontró el favorito");
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Favorito[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Favorito favorito) {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", favorito.getId() != null ? favorito.getId().toString() : "");
        aux.put("fechaGuardado", favorito.getFechaGuardado() != null ? favorito.getFechaGuardado().toString() : "");
        aux.put("idAuto", favorito.getIdAuto() != null ? favorito.getIdAuto().toString() : "");
        aux.put("idUsuario", favorito.getIdUsuario() != null ? favorito.getIdUsuario().toString() : "");
        return aux;
    }

    // Ordenar por atributo usando AdapterDao
    public LinkedList<Favorito> ordenarPorAtributo(String atributo, Integer type) {
        LinkedList<HashMap<String, String>> lista = all();

        if (atributo.equals("id") || atributo.equals("idAuto") || atributo.equals("idUsuario")) {
            ordenarNumero(lista, atributo, type);
        } else {
            ordenarAtributo(lista, atributo, type);
        }

        LinkedList<Favorito> resultado = new LinkedList<>();
        for (HashMap<String, String> map : lista.toArray()) {
            Favorito f = new Favorito();
            f.setId(map.get("id").isEmpty() ? null : Integer.parseInt(map.get("id")));
            f.setFechaGuardado(map.get("fechaGuardado").isEmpty() ? null : Date.valueOf(map.get("fechaGuardado")));
            f.setIdAuto(map.get("idAuto").isEmpty() ? null : Integer.parseInt(map.get("idAuto")));
            f.setIdUsuario(map.get("idUsuario").isEmpty() ? null : Integer.parseInt(map.get("idUsuario")));
            resultado.add(f);
        }
        return resultado;
    }

    // Buscar por atributo (genérico)
    public LinkedList<Favorito> buscarPorAtributo(String atributo, String valor) {
        LinkedList<Favorito> resultado = new LinkedList<>();
        LinkedList<HashMap<String, String>> lista = all();

        for (HashMap<String, String> map : lista.toArray()) {
            String campo = map.get(atributo);
            if (campo != null && campo.equals(valor)) {
                Favorito f = new Favorito();
                f.setId(map.get("id").isEmpty() ? null : Integer.parseInt(map.get("id")));
                f.setFechaGuardado(map.get("fechaGuardado").isEmpty() ? null : Date.valueOf(map.get("fechaGuardado")));
                f.setIdAuto(map.get("idAuto").isEmpty() ? null : Integer.parseInt(map.get("idAuto")));
                f.setIdUsuario(map.get("idUsuario").isEmpty() ? null : Integer.parseInt(map.get("idUsuario")));
                resultado.add(f);
            }
        }
        return resultado;
    }

}
