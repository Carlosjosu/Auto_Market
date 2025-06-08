package com.unl.sistema.base.controller.dao.dao_models;

<<<<<<< HEAD
import java.util.HashMap;
=======
import java.util.Date;

import com.unl.sistema.base.controller.dao.AdapterDao;
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Auto;

<<<<<<< HEAD
public class DaoAuto extends AdapterDao<Auto> {
=======

public class DaoAuto extends AdapterDao<Auto>{
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
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
        aux.put("idVenta", String.valueOf(auto.getIdVenta()));
        aux.put("idMarca", String.valueOf(auto.getIdMarca()));
        aux.put("tipoCombustible", String.valueOf(auto.getTipoCombustible()));
        aux.put("categoria", String.valueOf(auto.getCategoria()));
        return aux;
    }

    public LinkedList<Auto> ordenarString(String atributo, Integer type) {
        LinkedList<Auto> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {
            Auto arreglo[] = listAll().toArray();
            int n = arreglo.length;
            String[] valores = new String[n];
            for (int i = 0; i < n; i++) {
                try {
                    String getter = "get" + atributo.substring(0, 1).toUpperCase() + atributo.substring(1);
                    valores[i] = String.valueOf(Auto.class.getMethod(getter).invoke(arreglo[i]));
                } catch (Exception e) {
                    valores[i] = "";
                }
            }
            if (type == Utiles.ASCENDENTE) {
                quickSortASC(valores, 0, n - 1);
            } else {
                quickSortDES(valores, 0, n - 1);
            }
            for (String valor : valores) {
                for (int i = 0; i < n; i++) {
                    try {
                        String getter = "get" + atributo.substring(0, 1).toUpperCase() + atributo.substring(1);
                        String val = String.valueOf(Auto.class.getMethod(getter).invoke(arreglo[i]));
                        if (arreglo[i] != null && val.equals(valor)) {
                            lista.add(arreglo[i]);
                        }
                    } catch (Exception e) {
                        // Ignorar
                    }
                }
            }
        }
        return lista;
    }

    public static <E extends Comparable<E>> void quickSortASC(E vec[], int inicio, int fin) {
        if (inicio >= fin)
            return;
        E pivote = vec[inicio];
        int elemIzq = inicio + 1;
        int elemDer = fin;
        while (elemIzq <= elemDer) {
            while (elemIzq <= fin && vec[elemIzq].compareTo(pivote) < 0) {
                elemIzq++;
            }
            while (elemDer > inicio && vec[elemDer].compareTo(pivote) >= 0) {
                elemDer--;
            }
            if (elemIzq < elemDer) {
                E temp = vec[elemIzq];
                vec[elemIzq] = vec[elemDer];
                vec[elemDer] = temp;
            }
        }
        if (elemDer > inicio) {
            E temp = vec[inicio];
            vec[inicio] = vec[elemDer];
            vec[elemDer] = temp;
        }
        quickSortASC(vec, inicio, elemDer - 1);
        quickSortASC(vec, elemDer + 1, fin);
    }

    public static <E extends Comparable<E>> void quickSortDES(E vec[], int inicio, int fin) {
        if (inicio >= fin)
            return;
        E pivote = vec[inicio];
        int elemIzq = inicio + 1;
        int elemDer = fin;
        while (elemIzq <= elemDer) {
            while (elemIzq <= fin && vec[elemIzq].compareTo(pivote) > 0) {
                elemIzq++;
            }
            while (elemDer > inicio && vec[elemDer].compareTo(pivote) <= 0) {
                elemDer--;
            }
            if (elemIzq < elemDer) {
                E temp = vec[elemIzq];
                vec[elemIzq] = vec[elemDer];
                vec[elemDer] = temp;
            }
        }
        if (elemDer > inicio) {
            E temp = vec[inicio];
            vec[inicio] = vec[elemDer];
            vec[elemDer] = temp;
        }
        quickSortDES(vec, inicio, elemDer - 1);
        quickSortDES(vec, elemDer + 1, fin);
    }

}
=======
 
}
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
