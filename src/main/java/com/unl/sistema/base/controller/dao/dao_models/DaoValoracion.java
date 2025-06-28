package com.unl.sistema.base.controller.dao.dao_models;

import java.util.Date;
import java.util.HashMap;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Valoracion;

public class DaoValoracion extends AdapterDao<Valoracion> {
    private Valoracion obj;

    public DaoValoracion() {
        super(Valoracion.class);
    }

    public Valoracion getObj() {
        if (obj == null)
            this.obj = new Valoracion();
        return this.obj;
    }

    public void setObj(Valoracion obj) {
        this.obj = obj;
    }

    public Boolean save(Valoracion v) {
        try {
            v.setId(listAll().getLength() + 1);
            this.persist(v);
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

    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Valoracion[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Valoracion valoracion) {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", valoracion.getId() != null ? valoracion.getId().toString() : "");
        aux.put("puntuacion", valoracion.getPuntuacion() != null ? valoracion.getPuntuacion().toString() : "");
        aux.put("fecha", valoracion.getFecha() != null ? DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss").format(
                valoracion.getFecha().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()) : "");
        aux.put("comentario", valoracion.getComentario() != null ? valoracion.getComentario() : "");
        aux.put("idVenta", valoracion.getIdVenta() != null ? valoracion.getIdVenta().toString() : "");
        return aux;
    }

    // Ordenar por atributo usando AdapterDao
    public LinkedList<Valoracion> ordenarPorAtributo(String atributo, Integer type) {
        LinkedList<HashMap<String, String>> lista = all();

        if (atributo.equals("id") || atributo.equals("puntuacion") || atributo.equals("idVenta")) {
            ordenarNumero(lista, atributo, type);
        } else {
            ordenarAtributo(lista, atributo, type);
        }

        LinkedList<Valoracion> resultado = new LinkedList<>();
        for (HashMap<String, String> map : lista.toArray()) {
            Valoracion v = new Valoracion();
            v.setId(map.get("id").isEmpty() ? null : Integer.parseInt(map.get("id")));
            v.setPuntuacion(map.get("puntuacion").isEmpty() ? null : Integer.parseInt(map.get("puntuacion")));
            if (map.get("fecha").isEmpty()) {
                v.setFecha(null);
            } else {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                LocalDateTime localDateTime = LocalDateTime.parse(map.get("fecha"), formatter);
                v.setFecha(Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant()));
            }
            v.setComentario(map.get("comentario"));
            v.setIdVenta(map.get("idVenta").isEmpty() ? null : Integer.parseInt(map.get("idVenta")));
            resultado.add(v);
        }
        return resultado;
    }

    // Buscar por atributo (igual que en DaoVenta)
    public LinkedList<Valoracion> buscarPorAtributo(String atributo, String valor) {
        LinkedList<Valoracion> resultado = new LinkedList<>();
        LinkedList<HashMap<String, String>> lista = all();

        for (HashMap<String, String> map : lista.toArray()) {
            String campo = map.get(atributo);
            if (campo != null && campo.equals(valor)) {
                Valoracion v = new Valoracion();
                v.setId(map.get("id").isEmpty() ? null : Integer.parseInt(map.get("id")));
                v.setPuntuacion(map.get("puntuacion").isEmpty() ? null : Integer.parseInt(map.get("puntuacion")));
                if (map.get("fecha").isEmpty()) {
                    v.setFecha(null);
                } else {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
                    LocalDateTime localDateTime = LocalDateTime.parse(map.get("fecha"), formatter);
                    v.setFecha(Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant()));
                }
                v.setComentario(map.get("comentario"));
                v.setIdVenta(map.get("idVenta").isEmpty() ? null : Integer.parseInt(map.get("idVenta")));
                resultado.add(v);
            }
        }
        return resultado;
    }
}
