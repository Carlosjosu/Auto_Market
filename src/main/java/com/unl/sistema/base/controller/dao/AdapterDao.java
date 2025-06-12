package com.unl.sistema.base.controller.dao;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.Scanner;

import com.unl.sistema.base.controller.datastruct.list.LinkedList; // Usa tu LinkedList pública
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
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
        }
        FileWriter fw = new FileWriter(file);
        fw.write(data);
        fw.flush();
        fw.close();
    }

    @Override
    public LinkedList<T> listAll() {
        LinkedList<T> lista = new LinkedList<>();
        try {
            String data = readFile();
            T[] m = (T[]) g.fromJson(data, java.lang.reflect.Array.newInstance(clazz, 0).getClass());
            lista.toList(m);
        } catch (Exception e) {
            System.out.println("Error lista: " + e.toString());
        }
        return lista;
    }

    @Override
    public void persist(T obj) throws Exception {
        LinkedList<T> list = listAll();
        list.add(obj);
        saveFile(g.toJson(list.toArray()));
    }

    @Override
    public void update(T obj, Integer pos) throws Exception {
        LinkedList<T> list = listAll();
        list.update(obj, pos);
        saveFile(g.toJson(list.toArray()));
    }

    @Override
    public void update_by_id(T obj, Integer id) throws Exception {
        throw new UnsupportedOperationException("Unimplemented method 'update_by_id'");
    }

    @Override
    public T get(Integer id) throws Exception {
        LinkedList<T> list = listAll();
        for (int i = 0; i < list.getLength(); i++) {
            T item = list.get(i);
            try {
                Integer itemId = (Integer) item.getClass().getMethod("getId").invoke(item);
                if (itemId != null && itemId.equals(id)) {
                    return item;
                }
            } catch (Exception e) {
                // Si el modelo no tiene getId, ignora
            }
        }
        return null;
    }
}