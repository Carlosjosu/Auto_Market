package com.unl.sistema.base.controller.dao.dao_models;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Auto;
import java.util.HashMap;

public class DaoAuto extends AdapterDao<Auto> {
    private Auto obj;

    public DaoAuto() {
        super(Auto.class);
    }

    public Auto getObj() {
        if (obj == null)
            this.obj = new Auto();
        return this.obj;
    }

    public void setObj(Auto obj) {
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

<<<<<<< HEAD
    //Auto
    //Marca
    //Valoracion
    //Venta??
    //Favorito
    

=======
    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Auto[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Auto auto) {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", String.valueOf(auto.getId()));
        aux.put("anio", String.valueOf(auto.getAnio()));
        aux.put("modelo", String.valueOf(auto.getModelo()));
        aux.put("puertas", String.valueOf(auto.getPuertas()));
        aux.put("color", String.valueOf(auto.getColor()));
        aux.put("kilometraje", String.valueOf(auto.getKilometraje()));
        aux.put("ciudad", String.valueOf(auto.getCiudad()));
        aux.put("precio", String.valueOf(auto.getPrecio()));
        aux.put("matricula", String.valueOf(auto.getMatricula()));
        aux.put("codigoVIN", String.valueOf(auto.getCodigoVIN()));
        aux.put("descripcion", String.valueOf(auto.getDescripcion()));
        aux.put("fechaRegistro", String.valueOf(auto.getFechaRegistro()));
        aux.put("estaDisponible", String.valueOf(auto.isEstaDisponible()));
        aux.put("idVendedor", String.valueOf(auto.getIdVendedor()));
        aux.put("idMarca", String.valueOf(auto.getIdMarca()));
        aux.put("tipoCombustible", String.valueOf(auto.getTipoCombustible()));
        aux.put("categoria", auto.getCategoria() != null ? auto.getCategoria().getValue() : null);
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
>>>>>>> origin/develop
}
