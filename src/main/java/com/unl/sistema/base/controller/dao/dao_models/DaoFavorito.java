package com.unl.sistema.base.controller.dao.dao_models;

import java.util.HashMap;

import com.unl.sistema.base.controller.Util.Utiles;
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
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======

>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
    public void setObj(Favorito obj) {
        this.obj = obj;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength() + 1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
<<<<<<< HEAD
<<<<<<< HEAD
            // Log de error
=======
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======
            // Log de error
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
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
<<<<<<< HEAD
<<<<<<< HEAD
            // Log de error
=======
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
            return false;
        }
    }
<<<<<<< HEAD

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

    public LinkedList<Favorito> ordenarString(String atributo, Integer type) {
        LinkedList<Favorito> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {
            Favorito arreglo[] = listAll().toArray();
            int n = arreglo.length;
            String[] valores = new String[n];
            for (int i = 0; i < n; i++) {
                try {
                    String getter = "get" + atributo.substring(0, 1).toUpperCase() + atributo.substring(1);
                    valores[i] = String.valueOf(Favorito.class.getMethod(getter).invoke(arreglo[i]));
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
                        String val = String.valueOf(Favorito.class.getMethod(getter).invoke(arreglo[i]));
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
=======
    public Boolean delete(Integer pos) {
        try {
            this.delete(pos);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public Favorito getById(Integer id) {
        try {
            return this.getById(id);
        } catch (Exception e) {
            return null;
        }
    }
    public Favorito getByPos(Integer pos) {
        try {
            return this.getByPos(pos);
        } catch (Exception e) {
            return null;
=======
            // Log de error
            return false;
            // TODO: handle exception
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
        }
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
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

    public LinkedList<Favorito> ordenarString(String atributo, Integer type) {
        LinkedList<Favorito> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {
            Favorito arreglo[] = listAll().toArray();
            int n = arreglo.length;
            String[] valores = new String[n];
            for (int i = 0; i < n; i++) {
                try {
                    String getter = "get" + atributo.substring(0, 1).toUpperCase() + atributo.substring(1);
                    valores[i] = String.valueOf(Favorito.class.getMethod(getter).invoke(arreglo[i]));
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
                        String val = String.valueOf(Favorito.class.getMethod(getter).invoke(arreglo[i]));
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
