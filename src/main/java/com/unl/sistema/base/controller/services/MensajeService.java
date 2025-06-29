package com.unl.sistema.base.controller.services;

import java.util.List;
import java.util.HashMap;

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
    private final DaoMensaje daoMensaje = new DaoMensaje();

    public void agregarMensaje(Mensaje mensaje) throws Exception {
        daoMensaje.addMensaje(mensaje);
    }

    public List<Mensaje> obtenerMensajesPorConversacion(Integer idConversacion) {
        return daoMensaje.getMensajesPorConversacion(idConversacion);
    }

    // Obtener mensajes ordenados por fecha
    public List<HashMap<String, String>> obtenerMensajesOrdenados(Integer idConversacion, Boolean ascendente) {
        try {
            LinkedList<Mensaje> mensajesOrdenados = daoMensaje.getMensajesOrdenadosPorFecha(idConversacion, ascendente);
            LinkedList<HashMap<String, String>> resultado = new LinkedList<>();

            for (int i = 0; i < mensajesOrdenados.getLength(); i++) {
                resultado.add(daoMensaje.toDict(mensajesOrdenados.get(i)));
            }

            // Convertir a List para el frontend
            List<HashMap<String, String>> lista = new java.util.ArrayList<>();
            for (int i = 0; i < resultado.getLength(); i++) {
                lista.add(resultado.get(i));
            }
            return lista;
        } catch (Exception e) {
            return new java.util.ArrayList<>();
        }
    }

    // Obtener siguiente mensaje no leído
    public HashMap<String, String> obtenerSiguienteMensajeNoLeido() throws Exception {
        Mensaje mensaje = daoMensaje.obtenerSiguienteMensajeNoLeido();
        return mensaje != null ? daoMensaje.toDict(mensaje) : null;
    }

    // Marcar mensaje como leído
    public void marcarComoLeido(Integer mensajeId) throws Exception {
        daoMensaje.marcarComoLeido(mensajeId);
    }

    // Buscar mensajes por contenido
    public List<HashMap<String, String>> buscarMensajes(String texto) {
        List<Mensaje> mensajes = daoMensaje.buscarMensajesPorContenido(texto);
        return mensajes.stream()
                .map(daoMensaje::toDict)
                .collect(java.util.stream.Collectors.toList());
    }

    // Obtener estadísticas de mensajes
    public HashMap<String, Object> obtenerEstadisticas(Integer usuarioId) {
        return daoMensaje.obtenerEstadisticas(usuarioId);
    }

    // Listar todos los mensajes
    public List<HashMap<String, String>> listMensajes() {
        LinkedList<HashMap<String, String>> lista = daoMensaje.all();
        List<HashMap<String, String>> resultado = new java.util.ArrayList<>();

        for (int i = 0; i < lista.getLength(); i++) {
            resultado.add(lista.get(i));
        }

        return resultado;
    }
}