package com.unl.sistema.base.controller.dao;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.HashMap;
import java.util.Scanner;
import java.util.Comparator;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;

import com.google.gson.Gson;

public class AdapterDao<T> implements InterfaceDao<T> {
    private Class<T> clazz;
    private Gson g;
    protected static String base_path = "data" + File.separatorChar;

    public AdapterDao(Class<T> clazz) {
        this.clazz = clazz;
        this.g = new Gson();
    }

    private String readFile() throws Exception {
        File file = new File(base_path + clazz.getSimpleName() + ".json");
        if (!file.exists()) {
            saveFile("[]");
        }
        StringBuilder sb = new StringBuilder();
        try (Scanner in = new Scanner(new FileReader(file))) {
            while (in.hasNextLine()) {
                sb.append(in.nextLine()).append("\n");
            }
        }
        return sb.toString();
    }

    private void saveFile(String data) throws Exception {
        File file = new File(base_path + clazz.getSimpleName() + ".json");
        // file.getParentFile().m
        if (!file.exists()) {
            file.createNewFile();
        }
        // if(!file.exists()) {
        FileWriter fw = new FileWriter(file);
        fw.write(data);
        fw.flush();
        fw.close();
        // file.close();
        // }
    }

    @Override
    public LinkedList<T> listAll() {
        // TODO Auto-generated method stub
        // throw new UnsupportedOperationException("Unimplemented method 'listAll'");
        LinkedList<T> lista = new LinkedList<>();
        try {
            String data = readFile();
            T[] m = (T[]) g.fromJson(data, java.lang.reflect.Array.newInstance(clazz, 0).getClass());
            lista.toList(m);

        } catch (Exception e) {
            System.out.println("Error lista" + e.toString());
            // TODO: handle exception
        }
        return lista;
    }

    @Override
    public void persist(T obj) throws Exception {
        // TODO Auto-generated method stub
        // throw new UnsupportedOperationException("Unimplemented method 'persist'");
        LinkedList<T> list = listAll();

        list.add(obj);
        saveFile(g.toJson(list.toArray()));
    }

    @Override
    public void update(T obj, Integer pos) throws Exception {
        LinkedList<T> list = listAll();
        list.update(obj, pos);
        saveFile(g.toJson(list.toArray()));
        // TODO Auto-generated method stub
        // throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public void update_by_id(T obj, Integer id) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update_by_id'");
    }

    @Override
    public T get(Integer id) throws Exception {
        if (!listAll().isEmpty()) {
            return busquedaBinaria(listAll().toArray(), 0, listAll().getLength() - 1, id);
        } else
            return null;
    }

    public T busquedaBinaria(T datos[], int inicio, int fin, Integer num) throws Exception {
        if (inicio > fin) {
            return null;
        }

        int mitad = (inicio + fin) / 2;

        if (((Integer) getMethod("Id", datos[mitad])) == num) {
            return datos[mitad];
        } else if (((Integer) getMethod("Id", datos[mitad])) > num) {
            return busquedaBinaria(datos, inicio, mitad - 1, num);
        } else {
            return busquedaBinaria(datos, mitad + 1, fin, num);
        }
    }

    private Object getMethod(String attribute, T obj) throws Exception {
        return obj.getClass().getMethod("get" + attribute).invoke(obj);
    }

    public HashMap<String, Object> buscarAtributo(HashMap<String, Object> datos[], int inicio, int fin, String atributo,
            String valor) throws Exception {
        if (inicio > fin) {
            return null;
        }

        int mitad = (inicio + fin) / 2;

        if (datos[mitad].get(atributo).toString().equals(valor)) {
            return datos[mitad];
        } else if (datos[mitad].get(atributo).toString().compareTo(valor) > 0) {
            return buscarAtributo(datos, inicio, mitad - 1, atributo, valor);
        } else {
            return buscarAtributo(datos, mitad + 1, fin, atributo, valor);
        }
    }

    public LinkedList<HashMap<String, String>> ordenarAtributo(LinkedList<HashMap<String, String>> lista,
            String atributo, Integer type) {
        if (!lista.isEmpty()) {
            HashMap<String, String> arreglo[] = lista.toArray();
            int n = arreglo.length;
            String[] valores = new String[n];
            for (int i = 0; i < n; i++) {
                valores[i] = arreglo[i].get(atributo).toString();
            }
            Utiles.quickSort(valores, 0, n - 1, type);
            lista.toList(arreglo);
        }
        return lista;
    }

    public LinkedList<HashMap<String, String>> ordenarNumero(LinkedList<HashMap<String, String>> lista, String atributo,
            Integer type) {
        if (!lista.isEmpty()) {
            HashMap<String, String> arreglo[] = lista.toArray();
            int n = arreglo.length;
            Integer[] valores = new Integer[n];
            for (int i = 0; i < n; i++) {
                valores[i] = Integer.parseInt(arreglo[i].get(atributo));
            }
            Utiles.quickSort(valores, 0, n - 1, type);
            lista.toList(arreglo);
        }
        return lista;
    }

}