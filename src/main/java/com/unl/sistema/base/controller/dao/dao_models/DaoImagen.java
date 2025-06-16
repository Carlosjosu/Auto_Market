package com.unl.sistema.base.controller.dao.dao_models;

import org.springframework.stereotype.Repository;
import java.util.HashMap;
import java.util.List;
import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Imagen;

@Repository
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
            obj.setId(listAll().getLength() + 1);
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
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void asociarImagenesAUnAuto(Integer idAuto, List<Integer> idsImagenes) {
        if (idsImagenes == null || idAuto == null)
            return;
        Imagen[] arreglo = this.listAll().toArray();
        for (int i = 0; i < arreglo.length; i++) {
            Imagen img = arreglo[i];
            if (idsImagenes.contains(img.getId())) {
                img.setIdAuto(idAuto);
                try {
                    this.update(img, i);
                } catch (Exception e) {
                }
            }
        }
    }

    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Imagen[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Imagen img) {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", String.valueOf(img.getId()));
        aux.put("url", img.getUrl());
        aux.put("descripcion", img.getDescripcion());
        aux.put("idAuto", String.valueOf(img.getIdAuto()));
        return aux;
    }

    public LinkedList<HashMap<String, String>> ordenarPorAtributo(String atributo, Integer type) {
        return ordenarAtributo(all(), atributo, type);
    }

    public LinkedList<HashMap<String, String>> ordenarPorNumero(String atributo, Integer type) {
        return ordenarNumero(all(), atributo, type);
    }

    public HashMap<String, String> buscarPorAtributo(String atributo, String valor) throws Exception {
        LinkedList<HashMap<String, String>> lista = all();
        HashMap<String, Object>[] datos = new HashMap[lista.getLength()];
        for (int i = 0; i < lista.getLength(); i++) {
            HashMap<String, String> original = lista.get(i);
            HashMap<String, Object> convertido = new HashMap<>();
            for (String key : original.keySet()) {
                convertido.put(key, original.get(key));
            }
            datos[i] = convertido;
        }
        HashMap<String, Object> resultado = buscarAtributo(datos, 0, datos.length - 1, atributo, valor);
        if (resultado == null)
            return null;
        HashMap<String, String> resultString = new HashMap<>();
        for (String key : resultado.keySet()) {
            Object val = resultado.get(key);
            resultString.put(key, val != null ? val.toString() : null);
        }
        return resultString;
    }
}
