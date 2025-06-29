package com.unl.sistema.base.controller.dao.dao_models;

import java.util.Date;
import java.util.List;
import java.util.HashMap;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Conversacion;
import org.springframework.stereotype.Repository;

@Repository
public class DaoConversacion extends AdapterDao<Conversacion> {
    private Conversacion obj;

    // Pila para conversaciones recientes (LIFO)
    private LinkedList<Conversacion> pilaConversacionesRecientes = new LinkedList<>();

    // Grafo de conexiones entre usuarios
    private HashMap<Integer, LinkedList<Integer>> grafoUsuarios = new HashMap<>();

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

    // Agrega conversación usando pila LIFO
    public void addConversacion(Conversacion conversacion) throws Exception {
        conversacion.setId(getAllAsList().size() + 1);
        conversacion.setFechaInicio(new Date());

        // Agregar a pila LIFO
        agregarAPila(conversacion);

        // Actualizar grafo de usuarios conectados
        actualizarGrafoUsuarios(conversacion.getIdEmisor(), conversacion.getIdReceptor());

        // Agregar a pila de conversaciones recientes
        pilaConversacionesRecientes.add(conversacion);

        // Mantener solo las 10 conversaciones más recientes en la pila
        if (pilaConversacionesRecientes.getLength() > 10) {
            pilaConversacionesRecientes.delete(0);
        }
    }

    // Actualizar grafo bidireccional de usuarios
    private void actualizarGrafoUsuarios(Integer usuario1, Integer usuario2) {
        // Conexión usuario1 -> usuario2
        if (!grafoUsuarios.containsKey(usuario1)) {
            grafoUsuarios.put(usuario1, new LinkedList<>());
        }
        if (!grafoUsuarios.get(usuario1).contains(usuario2)) {
            grafoUsuarios.get(usuario1).add(usuario2);
        }

        // Conexión usuario2 -> usuario1 (bidireccional)
        if (!grafoUsuarios.containsKey(usuario2)) {
            grafoUsuarios.put(usuario2, new LinkedList<>());
        }
        if (!grafoUsuarios.get(usuario2).contains(usuario1)) {
            grafoUsuarios.get(usuario2).add(usuario1);
        }
    }

    // Busca conversación entre dos usuarios
    public Conversacion findConversacion(Integer idEmisor, Integer idReceptor) {
        return getAllAsList().stream()
                .filter(c -> (c.getIdEmisor().equals(idEmisor) && c.getIdReceptor().equals(idReceptor)) ||
                        (c.getIdEmisor().equals(idReceptor) && c.getIdReceptor().equals(idEmisor)))
                .findFirst().orElse(null);
    }

    // Obtiene todas las conversaciones de un usuario
    public List<Conversacion> getConversacionesPorUsuario(Integer usuarioId) {
        return filter(c -> c.getIdEmisor().equals(usuarioId) || c.getIdReceptor().equals(usuarioId));
    }

    // Obtiene conversaciones recientes de la pila
    public LinkedList<Conversacion> getConversacionesRecientes() {
        return pilaConversacionesRecientes;
    }

    // Obtiene la conversación más reciente
    public Conversacion obtenerConversacionMasReciente() {
        if (!pilaConversacionesRecientes.isEmpty()) {
            return pilaConversacionesRecientes.get(pilaConversacionesRecientes.getLength() - 1);
        }
        return null;
    }

    // Buscar usuarios conectados (usando grafo)
    public LinkedList<Integer> obtenerUsuariosConectados(Integer usuarioId) {
        return grafoUsuarios.getOrDefault(usuarioId, new LinkedList<>());
    }

    // Encontrar ruta de comunicación entre usuarios (BFS)
    public LinkedList<Integer> encontrarRutaComunicacion(Integer origen, Integer destino) throws Exception {
        return buscarRutaEntreUsuarios(origen, destino);
    }

    // Verificar si dos usuarios están conectados
    public boolean usuariosEstaConnectados(Integer usuario1, Integer usuario2) {
        LinkedList<Integer> conexiones = grafoUsuarios.get(usuario1);
        return conexiones != null && conexiones.contains(usuario2);
    }

    // Obtener conversaciones ordenadas por fecha
    public LinkedList<Conversacion> getConversacionesOrdenadas(Integer usuarioId, boolean ascendente) throws Exception {
        List<Conversacion> conversacionesUsuario = getConversacionesPorUsuario(usuarioId);
        LinkedList<Conversacion> ordenadas = new LinkedList<>();

        for (Conversacion conv : conversacionesUsuario) {
            ordenadas.add(conv);
        }

        return ordenarPorFecha("FechaInicio", ascendente);
    }

    // Convertir a diccionario
    public HashMap<String, String> toDict(Conversacion conversacion) {
        HashMap<String, String> dict = new HashMap<>();
        dict.put("id", conversacion.getId().toString());
        dict.put("fechaInicio", conversacion.getFechaInicio().toString());
        dict.put("idEmisor", conversacion.getIdEmisor().toString());
        dict.put("idReceptor", conversacion.getIdReceptor().toString());
        return dict;
    }

    // Listar todas las conversaciones
    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Conversacion[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    // Obtener estadísticas de conversaciones
    public HashMap<String, Object> obtenerEstadisticas(Integer usuarioId) {
        HashMap<String, Object> stats = new HashMap<>();
        List<Conversacion> conversaciones = getConversacionesPorUsuario(usuarioId);

        stats.put("totalConversaciones", conversaciones.size());
        stats.put("usuariosConectados", obtenerUsuariosConectados(usuarioId).getLength());
        stats.put("conversacionesRecientes", pilaConversacionesRecientes.getLength());

        return stats;
    }
}