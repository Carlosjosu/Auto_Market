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
    public Marca findById(Integer id) {
        for (Marca marca : this.listAll().toArray()) {
            if (marca.getId() != null && marca.getId().equals(id)) {
                return marca;
            }
        }
        return null;
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

    public LinkedList<HashMap<String, String>> all(){
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if(!this.listAll().isEmpty()){
            Marca[] arreglo = this.listAll().toArray();
            for(int i = 0 ; i < arreglo.length ; i++){
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Marca arreglo) {
        DaoMarca da = new DaoMarca();
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", arreglo.getId().toString());
        aux.put("nombre", arreglo.getNombre());
        aux.put("estaActiva", String.valueOf(arreglo.isEstaActiva()));
        return aux;
    }

    public LinkedList<Marca> ordenarString(String atributo, Integer type) {
        LinkedList<Marca> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {
            Marca arreglo[] = listAll().toArray();
            int n = arreglo.length;
            String[] valores = new String[n];
            for (int i = 0; i < n; i++) {
                try {
                    String getter = "get" + atributo.substring(0, 1).toUpperCase() + atributo.substring(1);
                    valores[i] = String.valueOf(Marca.class.getMethod(getter).invoke(arreglo[i]));
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
                        String val = String.valueOf(Marca.class.getMethod(getter).invoke(arreglo[i]));
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
