package com.unl.sistema.base.controller.services;

import com.unl.sistema.base.controller.dao.dao_models.DaoConversacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.models.Conversacion;
import com.unl.sistema.base.models.Mensaje;
import com.unl.sistema.base.models.Usuario;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import java.util.List;

@BrowserCallable
@AnonymousAllowed
public class ChatService {
    
    private final DaoConversacion conversacionDao;
    private final DaoMensaje mensajeDao;
    private final DaoUsuario usuarioDao;
    
    public ChatService(DaoConversacion conversacionDao, DaoMensaje mensajeDao, DaoUsuario usuarioDao) {
        this.conversacionDao = conversacionDao;
        this.mensajeDao = mensajeDao;
        this.usuarioDao = usuarioDao;
    }
    
    public List<Conversacion> obtenerConversacionesUsuario(Long usuarioId) {
        return conversacionDao.findByUsuarioId(usuarioId);
    }
    
    public Conversacion crearConversacion(Long usuario1Id, Long usuario2Id) {
        Usuario usuario1 = usuarioDao.findById(usuario1Id);
        Usuario usuario2 = usuarioDao.findById(usuario2Id);
        
        Conversacion nuevaConversacion = new Conversacion();
        nuevaConversacion.setUsuario1(usuario1);
        nuevaConversacion.setUsuario2(usuario2);
        
        return conversacionDao.save(nuevaConversacion);
    }
    
    public List<Mensaje> obtenerMensajesConversacion(Long conversacionId) {
        return mensajeDao.findByConversacionId(conversacionId);
    }
    
    public Mensaje enviarMensaje(Long conversacionId, Long remitenteId, String contenido) {
        Conversacion conversacion = conversacionDao.findById(conversacionId);
        Usuario remitente = usuarioDao.findById(remitenteId);
        
        Mensaje mensaje = new Mensaje();
        mensaje.setConversacion(conversacion);
        mensaje.setRemitente(remitente);
        mensaje.setContenido(contenido);
        mensaje.setFechaEnvio(new java.util.Date());
        
        return mensajeDao.save(mensaje);
    }

    public DaoConversacion getConversacionDao() {
        return conversacionDao;
    }
}
