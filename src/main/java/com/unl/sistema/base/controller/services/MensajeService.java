package com.unl.sistema.base.controller.services;

import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Mensaje;

@Service
@BrowserCallable
@AnonymousAllowed
public class MensajeService {

    @Autowired
    private DaoMensaje daoMensaje;

    // Agregar mensaje usando cola FIFO con LinkedList
    public HashMap<String, Object> agregarMensaje(Mensaje mensaje) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            // Validaciones básicas
            if (mensaje == null) {
                response.put("estado", "error");
                response.put("mensaje", "Mensaje no puede ser null");
                return response;
            }

            if (mensaje.getContenido() == null || mensaje.getContenido().trim().isEmpty()) {
                response.put("estado", "error");
                response.put("mensaje", "Contenido del mensaje no puede estar vacío");
                return response;
            }

            if (mensaje.getIdConversacion() == null || mensaje.getIdRemitente() == null) {
                response.put("estado", "error");
                response.put("mensaje", "ID de conversación e ID de remitente son requeridos");
                return response;
            }

            // Limpiar contenido
            mensaje.setContenido(mensaje.getContenido().trim());

            // Agregar mensaje
            daoMensaje.addMensaje(mensaje);

            // Respuesta exitosa con múltiples formatos para compatibilidad
            response.put("estado", "success");
            response.put("message", "success"); // Para compatibilidad
            response.put("mensaje", "Mensaje enviado exitosamente");
            response.put("data", daoMensaje.mensajeToHashMap(mensaje));
            response.put("success", true); // Bandera adicional

            System.out.println("✅ Mensaje enviado exitosamente. ID: " + mensaje.getId() +
                    ", Conversación: " + mensaje.getIdConversacion() +
                    ", Remitente: " + mensaje.getIdRemitente());

        } catch (Exception e) {
            response.put("estado", "error");
            response.put("message", "error"); // Para compatibilidad
            response.put("mensaje", "Error al enviar mensaje: " + e.getMessage());
            response.put("error", e.getMessage());
            response.put("success", false);

            System.err.println("❌ Error enviando mensaje: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    // Obtener mensajes por conversación usando LinkedList
    public List<HashMap<String, String>> obtenerMensajesPorConversacion(Integer idConversacion) {
        try {
            LinkedList<Mensaje> mensajesLinked = daoMensaje.getMensajesPorConversacion(idConversacion);
            List<HashMap<String, String>> resultado = new ArrayList<>();

            for (int i = 0; i < mensajesLinked.getLength(); i++) {
                resultado.add(daoMensaje.mensajeToHashMap(mensajesLinked.get(i)));
            }

            System.out.println("Mensajes encontrados para conversación " + idConversacion + ": " + resultado.size());
            return resultado;
        } catch (Exception e) {
            System.err.println("Error obteniendo mensajes: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Obtener mensajes ordenados por fecha usando LinkedList
    public List<HashMap<String, String>> obtenerMensajesOrdenados(Integer idConversacion, Boolean ascendente) {
        try {
            LinkedList<Mensaje> mensajesOrdenados = daoMensaje.getMensajesOrdenadosPorFecha(idConversacion, ascendente);
            List<HashMap<String, String>> resultado = new ArrayList<>();

            for (int i = 0; i < mensajesOrdenados.getLength(); i++) {
                resultado.add(daoMensaje.mensajeToHashMap(mensajesOrdenados.get(i)));
            }

            return resultado;
        } catch (Exception e) {
            System.err.println("Error obteniendo mensajes ordenados: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Buscar mensajes por contenido usando LinkedList
    public List<HashMap<String, String>> buscarMensajes(String texto) {
        try {
            LinkedList<Mensaje> mensajes = daoMensaje.buscarMensajesPorContenido(texto);
            List<HashMap<String, String>> resultado = new ArrayList<>();

            for (int i = 0; i < mensajes.getLength(); i++) {
                resultado.add(daoMensaje.mensajeToHashMap(mensajes.get(i)));
            }

            return resultado;
        } catch (Exception e) {
            System.err.println("Error buscando mensajes: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Obtener estadísticas usando LinkedList
    public HashMap<String, Object> obtenerEstadisticas(Integer usuarioId) {
        try {
            return daoMensaje.obtenerEstadisticas(usuarioId);
        } catch (Exception e) {
            System.err.println("Error obteniendo estadísticas: " + e.getMessage());
            return new HashMap<>();
        }
    }

    // Obtener últimos mensajes usando LinkedList
    public List<HashMap<String, String>> obtenerUltimosMensajes(Integer limite) {
        try {
            LinkedList<Mensaje> ultimos = daoMensaje.obtenerUltimosMensajes(limite);
            List<HashMap<String, String>> resultado = new ArrayList<>();

            for (int i = 0; i < ultimos.getLength(); i++) {
                resultado.add(daoMensaje.mensajeToHashMap(ultimos.get(i)));
            }

            return resultado;
        } catch (Exception e) {
            System.err.println("Error obteniendo últimos mensajes: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Contar mensajes por conversación
    public Integer contarMensajes(Integer idConversacion) {
        try {
            return daoMensaje.contarMensajesPorConversacion(idConversacion);
        } catch (Exception e) {
            System.err.println("Error contando mensajes: " + e.getMessage());
            return 0;
        }
    }

    // Listar todos los mensajes usando LinkedList
    public List<HashMap<String, String>> listarTodosMensajes() {
        try {
            LinkedList<HashMap<String, String>> mensajesLinked = daoMensaje.listarTodosComoHashMap();
            List<HashMap<String, String>> resultado = new ArrayList<>();

            for (int i = 0; i < mensajesLinked.getLength(); i++) {
                resultado.add(mensajesLinked.get(i));
            }

            return resultado;
        } catch (Exception e) {
            System.err.println("Error listando mensajes: " + e.getMessage());
            return new ArrayList<>();
        }
    }

}