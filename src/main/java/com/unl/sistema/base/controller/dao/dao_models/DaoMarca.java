package com.unl.sistema.base.controller.dao.dao_models;

import java.util.HashMap;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Marca;

public class DaoMarca extends AdapterDao<Marca> {
    private Marca obj;

    public DaoMarca() {
        super(Marca.class);
    }

    public Marca getObj() {
        if (obj == null)
            this.obj = new Marca();
        return this.obj;
    }

    public void setObj(Marca obj) {
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

    public Marca findById(Integer id) {
        for (Marca marca : this.listAll().toArray()) {
            if (marca.getId() != null && marca.getId().equals(id)) {
                return marca;
            }
        }
        return null;
    }

    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Marca[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Marca arreglo) {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", arreglo.getId().toString());
        aux.put("nombre", arreglo.getNombre());
        aux.put("estaActiva", String.valueOf(arreglo.isEstaActiva()));
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
        Utiles.quickSortObject(datos, 0, datos.length - 1, atributo, 1);
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