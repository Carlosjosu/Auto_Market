package com.unl.sistema.base.controller.dao;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.util.HashMap;
import java.util.Scanner;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.google.gson.Gson;

public class AdapterDao<T> implements InterfaceDao<T> {
    private Class<T> clazz;
    private Gson g;
    protected static String base_path = "data" + File.separatorChar;

    // ================= NUEVAS ESTRUCTURAS PARA CHAT =================
    // Grafo de conexiones usuario-usuario (LinkedList como adjacency list)
    protected HashMap<Integer, LinkedList<Integer>> grafoUsuarios = new HashMap<>();

    // Cola FIFO para mensajes (LinkedList)
    protected LinkedList<T> colaMensajes = new LinkedList<>();

    // Pila LIFO para conversaciones recientes (LinkedList)
    protected LinkedList<T> pilaConversaciones = new LinkedList<>();

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
        if (data == null || data.trim().equals("null")) {
            data = "[]";
        }
        File file = new File(base_path + clazz.getSimpleName() + ".json");
        try (FileWriter fw = new FileWriter(file)) {
            fw.write(data);
        }
    }

    @Override
    public LinkedList<T> listAll() {
        LinkedList<T> lista = new LinkedList<>();
        try {
            String data = readFile();
            T[] m = (T[]) g.fromJson(data, java.lang.reflect.Array.newInstance(clazz, 0).getClass());
            if (m != null) {
                lista.toList(m);
            }
        } catch (Exception e) {
            System.out.println("Error lista" + e.toString());
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
        if (!listAll().isEmpty()) {
            return busquedaBinaria(listAll().toArray(), 0, listAll().getLength() - 1, id);
        } else
            return null;
    }

    public void delete(T obj) throws Exception {
        LinkedList<T> list = listAll();
        for (int i = 0; i < list.getLength(); i++) {
            if (list.get(i).equals(obj)) {
                list.delete(i);
                break;
            }
        }
        saveFile(g.toJson(list.toArray()));
    }

    // ================= MÉTODOS PARA CHAT CON LINKEDLIST =================

    // Agregar mensaje usando cola FIFO
    public void addMensajeFIFO(T mensaje) throws Exception {
        colaMensajes.add(mensaje);
        persist(mensaje);
    }

    // Obtener siguiente mensaje de la cola
    public T obtenerSiguienteMensaje() throws Exception {
        if (!colaMensajes.isEmpty()) {
            return colaMensajes.delete(0); // FIFO
        }
        return null;
    }

    // Agregar conversación usando pila LIFO
    public void addConversacionLIFO(T conversacion) throws Exception {
        pilaConversaciones.add(conversacion);
        persist(conversacion);

        // Mantener solo las 20 conversaciones más recientes
        if (pilaConversaciones.getLength() > 20) {
            pilaConversaciones.delete(0);
        }
    }

    // Obtener conversación más reciente
    public T obtenerConversacionReciente() throws Exception {
        if (!pilaConversaciones.isEmpty()) {
            return pilaConversaciones.delete(pilaConversaciones.getLength() - 1); // LIFO
        }
        return null;
    }

    // Agregar conexión bidireccional al grafo
    public void agregarConexionGrafo(Integer usuario1, Integer usuario2) {
        // Agregar usuario1 -> usuario2
        if (!grafoUsuarios.containsKey(usuario1)) {
            grafoUsuarios.put(usuario1, new LinkedList<>());
        }
        LinkedList<Integer> conexiones1 = grafoUsuarios.get(usuario1);
        if (!conexiones1.contains(usuario2)) {
            conexiones1.add(usuario2);
        }

        // Agregar usuario2 -> usuario1 (bidireccional)
        if (!grafoUsuarios.containsKey(usuario2)) {
            grafoUsuarios.put(usuario2, new LinkedList<>());
        }
        LinkedList<Integer> conexiones2 = grafoUsuarios.get(usuario2);
        if (!conexiones2.contains(usuario1)) {
            conexiones2.add(usuario1);
        }
    }

    // Obtener usuarios conectados desde el grafo
    public LinkedList<Integer> obtenerUsuariosConectados(Integer usuarioId) {
        return grafoUsuarios.getOrDefault(usuarioId, new LinkedList<>());
    }

    // Verificar si dos usuarios están conectados
    public boolean estanConectados(Integer usuario1, Integer usuario2) {
        LinkedList<Integer> conexiones = grafoUsuarios.get(usuario1);
        return conexiones != null && conexiones.contains(usuario2);
    }

    // Buscar ruta entre usuarios usando BFS con LinkedList
    public LinkedList<Integer> buscarRutaUsuarios(Integer origen, Integer destino) throws Exception {
        LinkedList<Integer> visitados = new LinkedList<>();
        LinkedList<Integer> cola = new LinkedList<>();
        HashMap<Integer, Integer> padres = new HashMap<>();

        cola.add(origen);
        visitados.add(origen);
        padres.put(origen, -1);

        while (!cola.isEmpty()) {
            Integer actual = cola.delete(0); // FIFO para BFS

            if (actual.equals(destino)) {
                // Reconstruir ruta usando LinkedList
                LinkedList<Integer> ruta = new LinkedList<>();
                Integer temp = destino;
                while (temp != -1) {
                    ruta.add(temp);
                    temp = padres.get(temp);
                }
                return ruta;
            }

            LinkedList<Integer> vecinos = grafoUsuarios.get(actual);
            if (vecinos != null) {
                for (int i = 0; i < vecinos.getLength(); i++) {
                    Integer vecino = vecinos.get(i);
                    if (!visitados.contains(vecino)) {
                        visitados.add(vecino);
                        cola.add(vecino);
                        padres.put(vecino, actual);
                    }
                }
            }
        }
        return new LinkedList<>(); // Sin ruta
    }

    // Filtrar usando LinkedList con predicado
    public LinkedList<T> filtrarConLinkedList(Predicate<T> predicado) {
        LinkedList<T> todos = listAll();
        LinkedList<T> filtrados = new LinkedList<>();

        for (int i = 0; i < todos.getLength(); i++) {
            T item = todos.get(i);
            if (predicado.test(item)) {
                filtrados.add(item);
            }
        }
        return filtrados;
    }

    // Ordenar por fecha usando LinkedList (algoritmo burbuja)
    public LinkedList<T> ordenarPorFechaLinkedList(String atributoFecha, boolean ascendente) throws Exception {
        LinkedList<T> lista = listAll();
        if (lista.isEmpty())
            return lista;

        // Ordenamiento burbuja optimizado para LinkedList
        for (int i = 0; i < lista.getLength() - 1; i++) {
            for (int j = 0; j < lista.getLength() - 1 - i; j++) {
                T obj1 = lista.get(j);
                T obj2 = lista.get(j + 1);

                Object fecha1 = getMethod(atributoFecha, obj1);
                Object fecha2 = getMethod(atributoFecha, obj2);

                if (fecha1 instanceof java.util.Date && fecha2 instanceof java.util.Date) {
                    java.util.Date d1 = (java.util.Date) fecha1;
                    java.util.Date d2 = (java.util.Date) fecha2;

                    boolean intercambiar = ascendente ? d1.after(d2) : d1.before(d2);

                    if (intercambiar) {
                        lista.update(obj2, j);
                        lista.update(obj1, j + 1);
                    }
                }
            }
        }
        return lista;
    }

    // ================= MÉTODOS AUXILIARES EXISTENTES =================

    // Agrega un elemento (FIFO)
    public void addFIFO(T obj) throws Exception {
        LinkedList<T> list = listAll();
        list.add(obj);
        saveFile(g.toJson(list.toArray()));
    }

    // Obtiene todos los elementos como lista Java
    public List<T> getAllAsList() {
        LinkedList<T> list = listAll();
        List<T> result = new ArrayList<>();
        for (int i = 0; i < list.getLength(); i++) {
            result.add(list.get(i));
        }
        return result;
    }

    // Filtra por predicado (ej: por idConversacion)
    public List<T> filter(Predicate<T> predicate) {
        List<T> all = getAllAsList();
        List<T> filtered = new ArrayList<>();
        for (T t : all) {
            if (predicate.test(t)) {
                filtered.add(t);
            }
        }
        return filtered;
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