package com.unl.sistema.base.controller.dao.dao_models;

import java.util.Date;
import java.util.List;
import java.util.HashMap;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Mensaje;
import org.springframework.stereotype.Component;

@Component
public class DaoMensaje extends AdapterDao<Mensaje> {
    private Mensaje obj;

<<<<<<< HEAD
    // Cola específica para mensajes no leídos
    private LinkedList<Mensaje> colaMensajesNoLeidos = new LinkedList<>();

    // Grafo de comunicación entre usuarios
    private HashMap<Integer, LinkedList<Integer>> grafoComunicacion = new HashMap<>();

=======
>>>>>>> origin/feature/Tayron_ModuloMensajes
    public DaoMensaje() {
        super(Mensaje.class);
    }

    public Mensaje getObj() {
        if (obj == null)
            this.obj = new Mensaje();
        return this.obj;
    }

    public void setObj(Mensaje obj) {
        this.obj = obj;
    }

<<<<<<< HEAD
    // Agrega mensaje usando cola FIFO
    public void addMensaje(Mensaje mensaje) throws Exception {
        mensaje.setId(getAllAsList().size() + 1);
        mensaje.setFechaEnvio(new Date());

        // Agregar a cola FIFO
        agregarACola(mensaje);

        // Actualizar grafo de comunicación
        actualizarGrafoComunicacion(mensaje.getIdRemitente(), mensaje.getIdConversacion());

        // Si es mensaje no leído, agregar a cola específica
        colaMensajesNoLeidos.add(mensaje);
    }

    // Actualizar grafo de comunicación entre usuarios
    private void actualizarGrafoComunicacion(Integer remitenteId, Integer conversacionId) {
        if (!grafoComunicacion.containsKey(remitenteId)) {
            grafoComunicacion.put(remitenteId, new LinkedList<>());
        }
        if (!grafoComunicacion.get(remitenteId).contains(conversacionId)) {
            grafoComunicacion.get(remitenteId).add(conversacionId);
        }
    }

    // Obtiene mensajes por conversación usando filtros avanzados
    public List<Mensaje> getMensajesPorConversacion(Integer idConversacion) {
        return filter(m -> m.getIdConversacion().equals(idConversacion));
    }

    // Obtiene mensajes ordenados por fecha
    public LinkedList<Mensaje> getMensajesOrdenadosPorFecha(Integer idConversacion, boolean ascendente)
            throws Exception {
        LinkedList<Mensaje> todosMensajes = ordenarPorFecha("FechaEnvio", ascendente);
        LinkedList<Mensaje> mensajesConversacion = new LinkedList<>();

        for (int i = 0; i < todosMensajes.getLength(); i++) {
            Mensaje mensaje = todosMensajes.get(i);
            if (mensaje.getIdConversacion().equals(idConversacion)) {
                mensajesConversacion.add(mensaje);
            }
        }

        return mensajesConversacion;
    }

    // Obtiene siguiente mensaje no leído de la cola
    public Mensaje obtenerSiguienteMensajeNoLeido() throws Exception {
        if (!colaMensajesNoLeidos.isEmpty()) {
            return colaMensajesNoLeidos.delete(0);
        }
        return null;
    }

    // Marcar mensaje como leído (remover de cola no leídos)
    public void marcarComoLeido(Integer mensajeId) throws Exception {
        for (int i = 0; i < colaMensajesNoLeidos.getLength(); i++) {
            if (colaMensajesNoLeidos.get(i).getId().equals(mensajeId)) {
                colaMensajesNoLeidos.delete(i);
                break;
            }
        }
    }

    // Buscar mensajes por contenido
    public List<Mensaje> buscarMensajesPorContenido(String texto) {
        return filter(m -> m.getContenido().toLowerCase().contains(texto.toLowerCase()));
    }

    // Obtener estadísticas de mensajes
    public HashMap<String, Object> obtenerEstadisticas(Integer usuarioId) {
        HashMap<String, Object> stats = new HashMap<>();
        List<Mensaje> mensajesUsuario = filter(m -> m.getIdRemitente().equals(usuarioId));

        stats.put("totalMensajes", mensajesUsuario.size());
        stats.put("mensajesNoLeidos", colaMensajesNoLeidos.getLength());
        stats.put("conversacionesActivas", grafoComunicacion.getOrDefault(usuarioId, new LinkedList<>()).getLength());

        return stats;
    }

    // Convertir a diccionario
    public HashMap<String, String> toDict(Mensaje mensaje) {
        HashMap<String, String> dict = new HashMap<>();
        dict.put("id", mensaje.getId().toString());
        dict.put("contenido", mensaje.getContenido());
        dict.put("fechaEnvio", mensaje.getFechaEnvio().toString());
        dict.put("idRemitente", mensaje.getIdRemitente().toString());
        dict.put("idConversacion", mensaje.getIdConversacion().toString());
        return dict;
    }

    // Listar todos los mensajes
    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Mensaje[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
=======
    // Agrega mensaje (FIFO)
    public void addMensaje(Mensaje mensaje) throws Exception {
        mensaje.setId(getAllAsList().size() + 1);
        mensaje.setFechaEnvio(new Date());
        addFIFO(mensaje);
    }

    // Obtiene mensajes por idConversacion (FIFO)
    public List<Mensaje> getMensajesPorConversacion(Integer idConversacion) {
        return filter(m -> m.getIdConversacion().equals(idConversacion));
>>>>>>> origin/feature/Tayron_ModuloMensajes
    }
}