package com.unl.sistema.base.controller.dao.dao_models;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Conversacion;
import org.springframework.stereotype.Repository;

@Repository
public class DaoConversacion extends AdapterDao<Conversacion> {
    private Conversacion obj;

    public DaoConversacion() {
        super(Conversacion.class);
    }

    public Conversacion getObj() {
        if (obj == null)
            this.obj = new Conversacion();
        return this.obj;
    }

    public void setObj(Conversacion obj) {
        this.obj = obj;
    }

    // Agrega conversación usando pila LIFO con LinkedList
    public void addConversacion(Conversacion conversacion) throws Exception {
        LinkedList<Conversacion> lista = listAll();
        conversacion.setId(lista.getLength() + 1);
        conversacion.setFechaInicio(new Date());
        conversacion.setEstaActiva(true);

        // Usar pila LIFO específica para conversaciones
        addConversacionLIFO(conversacion);

        // Agregar conexión bidireccional al grafo
        agregarConexionGrafo(conversacion.getIdEmisor(), conversacion.getIdReceptor());

        System.out.println("Conversación creada entre usuarios: " +
                conversacion.getIdEmisor() + " y " + conversacion.getIdReceptor() +
                " con ID: " + conversacion.getId());
    }

    // Busca conversación entre dos usuarios usando LinkedList
    public Conversacion findConversacion(Integer idEmisor, Integer idReceptor) {
        LinkedList<Conversacion> conversaciones = listAll();

        for (int i = 0; i < conversaciones.getLength(); i++) {
            Conversacion c = conversaciones.get(i);
            if ((c.getIdEmisor().equals(idEmisor) && c.getIdReceptor().equals(idReceptor)) ||
                    (c.getIdEmisor().equals(idReceptor) && c.getIdReceptor().equals(idEmisor))) {
                return c;
            }
        }
        return null;
    }

    // Obtiene todas las conversaciones de un usuario usando LinkedList
    public LinkedList<Conversacion> getConversacionesPorUsuario(Integer usuarioId) {
        return filtrarConLinkedList(c -> c.getIdEmisor().equals(usuarioId) || c.getIdReceptor().equals(usuarioId));
    }

    // Convertir LinkedList a List para compatibilidad
    public List<Conversacion> getConversacionesPorUsuarioList(Integer usuarioId) {
        LinkedList<Conversacion> conversacionesLinked = getConversacionesPorUsuario(usuarioId);
        List<Conversacion> conversacionesList = new ArrayList<>();

        for (int i = 0; i < conversacionesLinked.getLength(); i++) {
            conversacionesList.add(conversacionesLinked.get(i));
        }

        return conversacionesList;
    }

    // Crear o buscar conversación (método híbrido con LinkedList)
    public Conversacion crearOBuscarConversacion(Integer idEmisor, Integer idReceptor, Integer idAuto)
            throws Exception {
        // Primero buscar usando LinkedList
        Conversacion existente = findConversacion(idEmisor, idReceptor);

        if (existente != null) {
            System.out.println("Conversación existente encontrada: " + existente.getId());
            return existente;
        }

        // Si no existe, crear nueva
        Conversacion nueva = new Conversacion();
        nueva.setIdEmisor(idEmisor);
        nueva.setIdReceptor(idReceptor);
        nueva.setIdAuto(idAuto);

        addConversacion(nueva);

        return nueva;
    }

    // Obtener usuarios conectados desde el grafo usando LinkedList
    public LinkedList<Integer> obtenerUsuariosConectadosLinkedList(Integer usuarioId) {
        return obtenerUsuariosConectados(usuarioId);
    }

    // Convertir a List para compatibilidad
    public List<Integer> obtenerUsuariosConectadosList(Integer usuarioId) {
        LinkedList<Integer> conectadosLinked = obtenerUsuariosConectadosLinkedList(usuarioId);
        List<Integer> conectadosList = new ArrayList<>();

        for (int i = 0; i < conectadosLinked.getLength(); i++) {
            conectadosList.add(conectadosLinked.get(i));
        }

        return conectadosList;
    }

    // Verificar conexión entre usuarios usando grafo
    public boolean usuariosEstanConectados(Integer usuario1, Integer usuario2) {
        return estanConectados(usuario1, usuario2);
    }

    // Buscar ruta entre usuarios usando BFS con LinkedList
    public LinkedList<Integer> encontrarRutaEntreUsuarios(Integer origen, Integer destino) throws Exception {
        return buscarRutaUsuarios(origen, destino);
    }

    // Obtener conversaciones recientes usando pila LIFO
    public LinkedList<Conversacion> obtenerConversacionesRecientes(Integer usuarioId, Integer limite) {
        LinkedList<Conversacion> todasConversaciones = getConversacionesPorUsuario(usuarioId);
        LinkedList<Conversacion> recientes = new LinkedList<>();

        // Tomar las más recientes (desde el final de la lista)
        int inicio = Math.max(0, todasConversaciones.getLength() - limite);
        for (int i = inicio; i < todasConversaciones.getLength(); i++) {
            recientes.add(todasConversaciones.get(i));
        }

        return recientes;
    }

    // Obtener estadísticas usando LinkedList y grafo
    public HashMap<String, Object> obtenerEstadisticasConversaciones(Integer usuarioId) {
        HashMap<String, Object> stats = new HashMap<>();
        LinkedList<Conversacion> conversaciones = getConversacionesPorUsuario(usuarioId);
        LinkedList<Integer> usuariosConectados = obtenerUsuariosConectadosLinkedList(usuarioId);

        stats.put("totalConversaciones", conversaciones.getLength());
        stats.put("usuariosConectados", usuariosConectados.getLength());
        stats.put("conversacionesActivas", contarConversacionesActivas(conversaciones));

        return stats;
    }

    // Contar conversaciones activas usando LinkedList
    private Integer contarConversacionesActivas(LinkedList<Conversacion> conversaciones) {
        Integer activas = 0;
        for (int i = 0; i < conversaciones.getLength(); i++) {
            if (conversaciones.get(i).isEstaActiva()) {
                activas++;
            }
        }
        return activas;
    }

    // Convertir conversación a HashMap para serialización
    public HashMap<String, String> conversacionToHashMap(Conversacion conversacion) {
        HashMap<String, String> map = new HashMap<>();
        map.put("id", conversacion.getId().toString());
        map.put("idEmisor", conversacion.getIdEmisor().toString());
        map.put("idReceptor", conversacion.getIdReceptor().toString());
        map.put("fechaInicio", conversacion.getFechaInicio().toString());
        map.put("estaActiva", Boolean.toString(conversacion.isEstaActiva()));
        if (conversacion.getIdAuto() != null) {
            map.put("idAuto", conversacion.getIdAuto().toString());
        }
        return map;
    }

    // Listar todas las conversaciones como HashMap usando LinkedList
    public LinkedList<HashMap<String, String>> listarTodasComoHashMap() {
        LinkedList<Conversacion> conversaciones = listAll();
        LinkedList<HashMap<String, String>> resultado = new LinkedList<>();

        for (int i = 0; i < conversaciones.getLength(); i++) {
            resultado.add(conversacionToHashMap(conversaciones.get(i)));
        }

        return resultado;
    }

    // Mantener métodos originales para compatibilidad
    public List<Conversacion> getAllAsList() {
        return super.getAllAsList();
    }

    public List<Conversacion> filter(java.util.function.Predicate<Conversacion> predicate) {
        return super.filter(predicate);
    }
}