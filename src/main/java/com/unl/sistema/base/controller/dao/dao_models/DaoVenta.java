package com.unl.sistema.base.controller.dao.dao_models;

<<<<<<< HEAD
<<<<<<< HEAD
import java.util.HashMap;
=======
import java.util.Date;
=======
import java.util.HashMap;
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.AdapterDao;
<<<<<<< HEAD
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.AdapterDao;
=======
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Venta;

public class DaoVenta extends AdapterDao<Venta> {
    private Venta obj;

    public DaoVenta() {
        super(Venta.class);
    }

    public Venta getObj() {
        if (obj == null)
            this.obj = new Venta();
        return this.obj;
    }

    public void setObj(Venta obj) {
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
<<<<<<< HEAD
<<<<<<< HEAD

    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Venta[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Venta venta) {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", venta.getId() != null ? venta.getId().toString() : "");
        aux.put("precioFinal", venta.getPrecioFinal() != null ? venta.getPrecioFinal().toString() : "");
        aux.put("fecha", venta.getFecha() != null ? venta.getFecha().toString() : "");
        aux.put("idAuto", venta.getIdAuto() != null ? venta.getIdAuto().toString() : "");
        aux.put("idComprador", venta.getIdComprador() != null ? venta.getIdComprador().toString() : "");
        return aux;
    }

    public LinkedList<Venta> ordenarString(String atributo, Integer type) {
        LinkedList<Venta> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {
            Venta arreglo[] = listAll().toArray();
            int n = arreglo.length;
            String[] valores = new String[n];
            for (int i = 0; i < n; i++) {
                try {
                    String getter = "get" + atributo.substring(0, 1).toUpperCase() + atributo.substring(1);
                    valores[i] = String.valueOf(Venta.class.getMethod(getter).invoke(arreglo[i]));
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
                        String val = String.valueOf(Venta.class.getMethod(getter).invoke(arreglo[i]));
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
    public Boolean delete(Integer pos) {
        try {
            this.delete(pos);
            return true;
        } catch (Exception e) {
            // Log de error
            return false;
        }
    }
    

}
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======

    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Venta[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Venta venta) {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", venta.getId() != null ? venta.getId().toString() : "");
        aux.put("precioFinal", venta.getPrecioFinal() != null ? venta.getPrecioFinal().toString() : "");
        aux.put("fecha", venta.getFecha() != null ? venta.getFecha().toString() : "");
        aux.put("idAuto", venta.getIdAuto() != null ? venta.getIdAuto().toString() : "");
        aux.put("idComprador", venta.getIdComprador() != null ? venta.getIdComprador().toString() : "");
        return aux;
    }

    public LinkedList<Venta> ordenarString(String atributo, Integer type) {
        LinkedList<Venta> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {
            Venta arreglo[] = listAll().toArray();
            int n = arreglo.length;
            String[] valores = new String[n];
            for (int i = 0; i < n; i++) {
                try {
                    String getter = "get" + atributo.substring(0, 1).toUpperCase() + atributo.substring(1);
                    valores[i] = String.valueOf(Venta.class.getMethod(getter).invoke(arreglo[i]));
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
                        String val = String.valueOf(Venta.class.getMethod(getter).invoke(arreglo[i]));
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
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
