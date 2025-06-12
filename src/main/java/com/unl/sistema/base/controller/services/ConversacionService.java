package com.unl.sistema.base.controller.services;

import com.unl.sistema.base.controller.dao.dao_models.DaoConversacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.models.Conversacion;
import com.unl.sistema.base.models.Mensaje;
import com.unl.sistema.base.models.Usuario;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.messages.MessageList;
import com.vaadin.flow.component.messages.MessageListItem;
import com.vaadin.flow.component.messages.MessageInput;

import java.time.ZoneOffset;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ConversacionService extends VerticalLayout {

    private final DaoConversacion conversacionDao;
    private final DaoMensaje mensajeDao;
    private final DaoUsuario usuarioDao;

    private final MessageList messageList;
    private final MessageInput messageInput;
    private final Long conversacionId;
    private final Long usuarioActualId;

    public ConversacionService(DaoConversacion conversacionDao, DaoMensaje mensajeDao, DaoUsuario usuarioDao, Long conversacionId, Long usuarioActualId) {
        this.conversacionDao = conversacionDao;
        this.mensajeDao = mensajeDao;
        this.usuarioDao = usuarioDao;
        this.conversacionId = conversacionId;
        this.usuarioActualId = usuarioActualId;

        messageList = new MessageList();
        messageInput = new MessageInput();

        cargarMensajes();

        messageInput.addSubmitListener(submitEvent -> {
            String contenido = submitEvent.getValue();
            if (!contenido.trim().isEmpty()) {
                enviarMensaje(contenido);
            }
        });

        add(messageList, messageInput);
    }

    private void cargarMensajes() {
        List<Mensaje> mensajes = mensajeDao.findByConversacionId(conversacionId);
        List<MessageListItem> items = mensajes.stream().map(mensaje -> {
            Usuario remitente = mensaje.getRemitente();
            MessageListItem item = new MessageListItem(
                mensaje.getContenido(),
                mensaje.getFechaEnvio().toInstant().atZone(ZoneOffset.systemDefault()).toInstant(),
                remitente.getNombre()
            );
            // Puedes personalizar el color o la imagen del usuario aquí si lo deseas
            item.setUserColorIndex(remitente.getId().intValue() % 5 + 1);
            return item;
        }).collect(Collectors.toList());
        messageList.setItems(items);
    }

    private void enviarMensaje(String contenido) {
        Conversacion conversacion = conversacionDao.findById(conversacionId);
        Usuario remitente = usuarioDao.findById(usuarioActualId);

        Mensaje mensaje = new Mensaje();
        mensaje.setConversacion(conversacion);
        mensaje.setRemitente(remitente);
        mensaje.setContenido(contenido);
        mensaje.setFechaEnvio(new java.util.Date());

        mensajeDao.save(mensaje);

        Notification.show("Mensaje enviado", 2000, Notification.Position.MIDDLE);
        cargarMensajes();
    }

    public List<Conversacion> obtenerConversacionesUsuario(Long usuarioId) {
        return conversacionDao.findByUsuarioId(usuarioId);
    }

    public Conversacion crearConversacion(Integer idEmisor, Integer idReceptor, Integer idAuto) {
        Conversacion c = new Conversacion();
        c.setIdEmisor(idEmisor);
        c.setIdReceptor(idReceptor);
        c.setIdAuto(idAuto);
        return conversacionDao.save(c);
    }

    public Conversacion buscarPorId(Long id) {
        return conversacionDao.findById(id);
    }
}