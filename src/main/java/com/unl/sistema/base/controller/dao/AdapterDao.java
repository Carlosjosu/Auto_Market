package com.unl.sistema.base.controller.dao;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
<<<<<<< HEAD
import java.util.HashMap;
import java.util.Scanner;
=======
<<<<<<< HEAD
>>>>>>> origin/feature/Tayron_ModuloMensajes
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;
<<<<<<< HEAD
=======
=======
import java.util.HashMap;
import java.util.Scanner;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
>>>>>>> origin/develop
>>>>>>> origin/feature/Tayron_ModuloMensajes

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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> origin/feature/Tayron_ModuloMensajes
    }

    public void delete(T obj) throws Exception {
        LinkedList<T> list = listAll();
        for (int i = 0; i < list.getLength(); i++) {
            if (list.get(i).equals(obj)) {
                list.delete(i);
                break;
            }
        }
<<<<<<< HEAD
=======
        // Persiste la lista actualizada
        saveFile(g.toJson(list.toArray()));
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
>>>>>>> origin/develop
    }

    public void delete(T obj) throws Exception {
        LinkedList<T> list = listAll();
        // Elimina el objeto de la lista
        for (int i = 0; i < list.getLength(); i++) {
            if (list.get(i).equals(obj)) {
                list.delete(i);
                break;
            }
        }
        // Persiste la lista actualizada
>>>>>>> origin/feature/Tayron_ModuloMensajes
        saveFile(g.toJson(list.toArray()));
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

    // FUNCIONALIDADES PARA MENSAJES/CONVERSACIONES

    // Cola para mensajes (FIFO)
    private LinkedList<T> colaMensajes = new LinkedList<>();

    // Pila para conversaciones (LIFO)
    private LinkedList<T> pilaConversaciones = new LinkedList<>();

    // Grafo de relaciones usuario-conversación
    private HashMap<Integer, LinkedList<Integer>> grafoConversaciones = new HashMap<>();

    // Agrega mensaje a la cola (FIFO)
    public void agregarACola(T mensaje) throws Exception {
        colaMensajes.add(mensaje);
        // También persiste en JSON
        persist(mensaje);
    }

    // Obtiene mensaje de la cola (FIFO)
    public T obtenerDeCola() throws Exception {
        if (!colaMensajes.isEmpty()) {
            return colaMensajes.delete(0);
        }
        return null;
    }

    // Agrega conversación a la pila (LIFO)
    public void agregarAPila(T conversacion) throws Exception {
        pilaConversaciones.add(conversacion);
        persist(conversacion);
    }

    // Obtiene conversación de la pila (LIFO)
    public T obtenerDePila() throws Exception {
        if (!pilaConversaciones.isEmpty()) {
            return pilaConversaciones.delete(pilaConversaciones.getLength() - 1);
        }
        return null;
    }

    // Agregar relación en el grafo (usuario -> conversación)
    public void agregarRelacionGrafo(Integer usuarioId, Integer conversacionId) {
        if (!grafoConversaciones.containsKey(usuarioId)) {
            grafoConversaciones.put(usuarioId, new LinkedList<>());
        }
        grafoConversaciones.get(usuarioId).add(conversacionId);
    }

    // Obtener conversaciones de un usuario desde el grafo
    public LinkedList<Integer> obtenerConversacionesUsuario(Integer usuarioId) {
        return grafoConversaciones.getOrDefault(usuarioId, new LinkedList<>());
    }

    // Buscar ruta entre dos usuarios en el grafo (BFS)
    public LinkedList<Integer> buscarRutaEntreUsuarios(Integer usuario1, Integer usuario2) throws Exception {
        LinkedList<Integer> visitados = new LinkedList<>();
        LinkedList<Integer> cola = new LinkedList<>();
        HashMap<Integer, Integer> padre = new HashMap<>();

        cola.add(usuario1);
        visitados.add(usuario1);
        padre.put(usuario1, -1);

        while (!cola.isEmpty()) {
            Integer actual = cola.delete(0);

            if (actual.equals(usuario2)) {
                // Reconstruir ruta
                LinkedList<Integer> ruta = new LinkedList<>();
                Integer temp = usuario2;
                while (temp != -1) {
                    ruta.add(temp);
                    temp = padre.get(temp);
                }
                return ruta;
            }

            LinkedList<Integer> adyacentes = grafoConversaciones.get(actual);
            if (adyacentes != null) {
                for (int i = 0; i < adyacentes.getLength(); i++) {
                    Integer vecino = adyacentes.get(i);
                    if (!visitados.contains(vecino)) {
                        visitados.add(vecino);
                        cola.add(vecino);
                        padre.put(vecino, actual);
                    }
                }
            }
        }
        return new LinkedList<>(); // No hay ruta
    }

    // Filtrar con múltiples predicados
    public List<T> filtrarConMultiplesCondiciones(Predicate<T>... predicados) {
        List<T> resultado = getAllAsList();
        for (Predicate<T> predicado : predicados) {
            resultado = resultado.stream().filter(predicado).collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
        }
        return resultado;
    }

    // Ordenar por fecha (para mensajes)
    public LinkedList<T> ordenarPorFecha(String atributoFecha, boolean ascendente) throws Exception {
        LinkedList<T> lista = listAll();
        if (lista.isEmpty())
            return lista;

        T[] array = lista.toArray();

        // Ordenamiento burbuja simple por fecha
        for (int i = 0; i < array.length - 1; i++) {
            for (int j = 0; j < array.length - 1 - i; j++) {
                Object fecha1 = getMethod(atributoFecha, array[j]);
                Object fecha2 = getMethod(atributoFecha, array[j + 1]);

                if (fecha1 instanceof java.util.Date && fecha2 instanceof java.util.Date) {
                    java.util.Date d1 = (java.util.Date) fecha1;
                    java.util.Date d2 = (java.util.Date) fecha2;

                    boolean intercambiar = ascendente ? d1.after(d2) : d1.before(d2);

                    if (intercambiar) {
                        T temp = array[j];
                        array[j] = array[j + 1];
                        array[j + 1] = temp;
                    }
                }
            }
        }

        lista.toList(array);
        return lista;
    }

}