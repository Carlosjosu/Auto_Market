package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.unl.sistema.base.controller.dao.dao_models.DaoConversacion;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Conversacion;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@Service
@BrowserCallable
@AnonymousAllowed
public class ConversacionService {

    @Autowired
    private DaoConversacion daoConversacion;

    // Crear conversación usando pila LIFO con LinkedList
    public HashMap<String, Object> agregarConversacion(Conversacion conversacion) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            daoConversacion.addConversacion(conversacion);
            response.put("estado", "success");
            response.put("mensaje", "Conversación creada exitosamente");
            response.put("data", daoConversacion.conversacionToHashMap(conversacion));
        } catch (Exception e) {
            response.put("estado", "error");
            response.put("mensaje", "Error al crear conversación: " + e.getMessage());
            System.err.println("Error creando conversación: " + e.getMessage());
        }
        return response;
    }

    // Buscar conversación entre usuarios usando LinkedList
    public HashMap<String, String> buscarConversacion(Integer idEmisor, Integer idReceptor) {
        try {
            Conversacion conversacion = daoConversacion.findConversacion(idEmisor, idReceptor);
            return conversacion != null ? daoConversacion.conversacionToHashMap(conversacion) : null;
        } catch (Exception e) {
            System.err.println("Error buscando conversación: " + e.getMessage());
            return null;
        }
    }

    // Crear o buscar conversación usando LinkedList y grafo
    public HashMap<String, String> crearOBuscarConversacion(Integer idEmisor, Integer idReceptor, Integer idAuto) {
        try {
            Conversacion conversacion = daoConversacion.crearOBuscarConversacion(idEmisor, idReceptor, idAuto);
            return conversacion != null ? daoConversacion.conversacionToHashMap(conversacion) : null;
        } catch (Exception e) {
            System.err.println("Error creando/buscando conversación: " + e.getMessage());
            return null;
        }
    }

    // Obtener conversaciones de un usuario usando LinkedList
    public List<HashMap<String, String>> obtenerConversacionesPorUsuario(Integer usuarioId) {
        try {
            LinkedList<Conversacion> conversacionesLinked = daoConversacion.getConversacionesPorUsuario(usuarioId);
            List<HashMap<String, String>> resultado = new ArrayList<>();

            for (int i = 0; i < conversacionesLinked.getLength(); i++) {
                resultado.add(daoConversacion.conversacionToHashMap(conversacionesLinked.get(i)));
            }

            System.out.println("Conversaciones encontradas para usuario " + usuarioId + ": " + resultado.size());
            return resultado;
        } catch (Exception e) {
            System.err.println("Error obteniendo conversaciones: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Obtener usuarios conectados desde el grafo usando LinkedList
    public List<Integer> obtenerUsuariosConectados(Integer usuarioId) {
        try {
            return daoConversacion.obtenerUsuariosConectadosList(usuarioId);
        } catch (Exception e) {
            System.err.println("Error obteniendo usuarios conectados: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Verificar si dos usuarios están conectados usando grafo
    public Boolean usuariosEstanConectados(Integer usuario1, Integer usuario2) {
        try {
            return daoConversacion.usuariosEstanConectados(usuario1, usuario2);
        } catch (Exception e) {
            System.err.println("Error verificando conexión: " + e.getMessage());
            return false;
        }
    }

    // Encontrar ruta entre usuarios usando BFS con LinkedList
    public List<Integer> encontrarRutaComunicacion(Integer origen, Integer destino) {
        try {
            LinkedList<Integer> rutaLinked = daoConversacion.encontrarRutaEntreUsuarios(origen, destino);
            List<Integer> ruta = new ArrayList<>();

            for (int i = 0; i < rutaLinked.getLength(); i++) {
                ruta.add(rutaLinked.get(i));
            }

            return ruta;
        } catch (Exception e) {
            System.err.println("Error encontrando ruta: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Obtener conversaciones recientes usando pila LIFO
    public List<HashMap<String, String>> obtenerConversacionesRecientes(Integer usuarioId, Integer limite) {
        try {
            LinkedList<Conversacion> recientesLinked = daoConversacion.obtenerConversacionesRecientes(usuarioId,
                    limite);
            List<HashMap<String, String>> resultado = new ArrayList<>();

            for (int i = 0; i < recientesLinked.getLength(); i++) {
                resultado.add(daoConversacion.conversacionToHashMap(recientesLinked.get(i)));
            }

            return resultado;
        } catch (Exception e) {
            System.err.println("Error obteniendo conversaciones recientes: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Obtener estadísticas usando LinkedList y grafo
    public HashMap<String, Object> obtenerEstadisticas(Integer usuarioId) {
        try {
            return daoConversacion.obtenerEstadisticasConversaciones(usuarioId);
        } catch (Exception e) {
            System.err.println("Error obteniendo estadísticas: " + e.getMessage());
            return new HashMap<>();
        }
    }

    // Listar todas las conversaciones usando LinkedList
    public List<HashMap<String, String>> listarTodasConversaciones() {
        try {
            LinkedList<HashMap<String, String>> conversacionesLinked = daoConversacion.listarTodasComoHashMap();
            List<HashMap<String, String>> resultado = new ArrayList<>();

            for (int i = 0; i < conversacionesLinked.getLength(); i++) {
                resultado.add(conversacionesLinked.get(i));
            }

            return resultado;
        } catch (Exception e) {
            System.err.println("Error listando conversaciones: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Mantener métodos originales para compatibilidad

}