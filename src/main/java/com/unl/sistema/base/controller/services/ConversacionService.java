package com.unl.sistema.base.controller.services;

import java.util.List;
import java.util.HashMap;

import org.springframework.stereotype.Service;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import com.unl.sistema.base.controller.dao.dao_models.DaoConversacion;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Conversacion;

@Service
@BrowserCallable
@AnonymousAllowed
public class ConversacionService {
    private final DaoConversacion daoConversacion = new DaoConversacion();

    public void agregarConversacion(Conversacion conversacion) throws Exception {
        daoConversacion.addConversacion(conversacion);
    }

    public Conversacion buscarConversacion(Integer idEmisor, Integer idReceptor) {
        return daoConversacion.findConversacion(idEmisor, idReceptor);
    }

    public List<Conversacion> obtenerConversacionesPorUsuario(Integer usuarioId) {
        return daoConversacion.getConversacionesPorUsuario(usuarioId);
    }

    // Obtener conversaciones recientes
    public List<HashMap<String, String>> obtenerConversacionesRecientes() {
        LinkedList<Conversacion> recientes = daoConversacion.getConversacionesRecientes();
        List<HashMap<String, String>> resultado = new java.util.ArrayList<>();

        for (int i = 0; i < recientes.getLength(); i++) {
            resultado.add(daoConversacion.toDict(recientes.get(i)));
        }

        return resultado;
    }

    // Obtener conversación más reciente
    public HashMap<String, String> obtenerConversacionMasReciente() {
        Conversacion conversacion = daoConversacion.obtenerConversacionMasReciente();
        return conversacion != null ? daoConversacion.toDict(conversacion) : null;
    }

    // Obtener usuarios conectados
    public List<Integer> obtenerUsuariosConectados(Integer usuarioId) {
        LinkedList<Integer> conectados = daoConversacion.obtenerUsuariosConectados(usuarioId);
        List<Integer> resultado = new java.util.ArrayList<>();

        for (int i = 0; i < conectados.getLength(); i++) {
            resultado.add(conectados.get(i));
        }

        return resultado;
    }

    // Verificar si usuarios están conectados
    public Boolean usuariosEstaConnectados(Integer usuario1, Integer usuario2) {
        return daoConversacion.usuariosEstaConnectados(usuario1, usuario2);
    }

    // Encontrar ruta de comunicación
    public List<Integer> encontrarRutaComunicacion(Integer origen, Integer destino) throws Exception {
        LinkedList<Integer> ruta = daoConversacion.encontrarRutaComunicacion(origen, destino);
        List<Integer> resultado = new java.util.ArrayList<>();

        for (int i = 0; i < ruta.getLength(); i++) {
            resultado.add(ruta.get(i));
        }

        return resultado;
    }

    // Obtener conversaciones ordenadas
    public List<HashMap<String, String>> obtenerConversacionesOrdenadas(Integer usuarioId, Boolean ascendente) {
        try {
            LinkedList<Conversacion> ordenadas = daoConversacion.getConversacionesOrdenadas(usuarioId, ascendente);
            List<HashMap<String, String>> resultado = new java.util.ArrayList<>();

            for (int i = 0; i < ordenadas.getLength(); i++) {
                resultado.add(daoConversacion.toDict(ordenadas.get(i)));
            }

            return resultado;
        } catch (Exception e) {
            return new java.util.ArrayList<>();
        }
    }

    // Obtener estadísticas
    public HashMap<String, Object> obtenerEstadisticas(Integer usuarioId) {
        return daoConversacion.obtenerEstadisticas(usuarioId);
    }

    // Listar todas las conversaciones
    public List<HashMap<String, String>> listConversaciones() {
        LinkedList<HashMap<String, String>> lista = daoConversacion.all();
        List<HashMap<String, String>> resultado = new java.util.ArrayList<>();

        for (int i = 0; i < lista.getLength(); i++) {
            resultado.add(lista.get(i));
        }

        return resultado;
    }
}