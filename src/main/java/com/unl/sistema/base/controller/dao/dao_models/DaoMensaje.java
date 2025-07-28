package com.unl.sistema.base.controller.dao.dao_models;

import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Mensaje;
import org.springframework.stereotype.Component;

@Component
public class DaoMensaje extends AdapterDao<Mensaje> {
    private Mensaje obj;

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

    // Agrega mensaje usando cola FIFO con LinkedList
    public void addMensaje(Mensaje mensaje) throws Exception {
        LinkedList<Mensaje> lista = listAll();
        mensaje.setId(lista.getLength() + 1);
        mensaje.setFechaEnvio(new Date());
        
        // Usar cola FIFO específica para mensajes
        addMensajeFIFO(mensaje);
        
        System.out.println("Mensaje agregado con ID: " + mensaje.getId() + 
                          " en conversación: " + mensaje.getIdConversacion());
    }

    // Obtiene mensajes por conversación usando LinkedList
    public LinkedList<Mensaje> getMensajesPorConversacion(Integer idConversacion) {
        return filtrarConLinkedList(m -> m.getIdConversacion().equals(idConversacion));
    }
    
    // Convertir LinkedList a List para compatibilidad
    public List<Mensaje> getMensajesPorConversacionList(Integer idConversacion) {
        LinkedList<Mensaje> mensajesLinked = getMensajesPorConversacion(idConversacion);
        List<Mensaje> mensajesList = new ArrayList<>();
        
        for (int i = 0; i < mensajesLinked.getLength(); i++) {
            mensajesList.add(mensajesLinked.get(i));
        }
        
        return mensajesList;
    }
    
    // Obtener mensajes ordenados por fecha usando LinkedList
    public LinkedList<Mensaje> getMensajesOrdenadosPorFecha(Integer idConversacion, boolean ascendente) throws Exception {
        LinkedList<Mensaje> todosMensajes = ordenarPorFechaLinkedList("FechaEnvio", ascendente);
        LinkedList<Mensaje> mensajesConversacion = new LinkedList<>();
        
        for (int i = 0; i < todosMensajes.getLength(); i++) {
            Mensaje mensaje = todosMensajes.get(i);
            if (mensaje.getIdConversacion().equals(idConversacion)) {
                mensajesConversacion.add(mensaje);
            }
        }
        
        return mensajesConversacion;
    }
    
    // Buscar mensajes por contenido usando LinkedList
    public LinkedList<Mensaje> buscarMensajesPorContenido(String texto) {
        return filtrarConLinkedList(m -> 
            m.getContenido().toLowerCase().contains(texto.toLowerCase())
        );
    }
    
    // Obtener últimos mensajes usando LinkedList (LIFO)
    public LinkedList<Mensaje> obtenerUltimosMensajes(Integer limite) {
        LinkedList<Mensaje> todosMensajes = listAll();
        LinkedList<Mensaje> ultimos = new LinkedList<>();
        
        int inicio = Math.max(0, todosMensajes.getLength() - limite);
        for (int i = inicio; i < todosMensajes.getLength(); i++) {
            ultimos.add(todosMensajes.get(i));
        }
        
        return ultimos;
    }
    
    // Contar mensajes por conversación usando LinkedList
    public Integer contarMensajesPorConversacion(Integer idConversacion) {
        LinkedList<Mensaje> mensajes = getMensajesPorConversacion(idConversacion);
        return mensajes.getLength();
    }
    
    // Obtener estadísticas usando LinkedList
    public HashMap<String, Object> obtenerEstadisticas(Integer usuarioId) {
        HashMap<String, Object> stats = new HashMap<>();
        LinkedList<Mensaje> todosMensajes = listAll();
        LinkedList<Mensaje> mensajesUsuario = new LinkedList<>();
        LinkedList<Integer> conversacionesUnicas = new LinkedList<>();
        
        // Filtrar mensajes del usuario y obtener conversaciones únicas
        for (int i = 0; i < todosMensajes.getLength(); i++) {
            Mensaje mensaje = todosMensajes.get(i);
            if (mensaje.getIdRemitente().equals(usuarioId)) {
                mensajesUsuario.add(mensaje);
                
                if (!conversacionesUnicas.contains(mensaje.getIdConversacion())) {
                    conversacionesUnicas.add(mensaje.getIdConversacion());
                }
            }
        }
        
        stats.put("totalMensajes", mensajesUsuario.getLength());
        stats.put("conversacionesActivas", conversacionesUnicas.getLength());
        
        return stats;
    }
    
    // Convertir mensaje a HashMap para serialización
    public HashMap<String, String> mensajeToHashMap(Mensaje mensaje) {
        HashMap<String, String> map = new HashMap<>();
        map.put("id", mensaje.getId().toString());
        map.put("contenido", mensaje.getContenido());
        map.put("fechaEnvio", mensaje.getFechaEnvio().toString());
        map.put("idRemitente", mensaje.getIdRemitente().toString());
        map.put("idConversacion", mensaje.getIdConversacion().toString());
        return map;
    }
    
    // Listar todos los mensajes como HashMap usando LinkedList
    public LinkedList<HashMap<String, String>> listarTodosComoHashMap() {
        LinkedList<Mensaje> mensajes = listAll();
        LinkedList<HashMap<String, String>> resultado = new LinkedList<>();
        
        for (int i = 0; i < mensajes.getLength(); i++) {
            resultado.add(mensajeToHashMap(mensajes.get(i)));
        }
        
        return resultado;
    }
}