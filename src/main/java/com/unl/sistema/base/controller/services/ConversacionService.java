package com.unl.sistema.base.controller.services;

import com.unl.sistema.base.controller.dao.dao_models.DaoConversacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoMensaje;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.models.Conversacion;
import com.unl.sistema.base.models.Mensaje;
import com.unl.sistema.base.models.Usuario;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

import com.vaadin.flow.component.messages.MessageList;
import com.vaadin.flow.component.messages.MessageListItem;
import com.vaadin.flow.component.messages.MessageInput;

import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;

public class ConversacionService<ConversacionRequest> extends VerticalLayout {

    private final DaoConversacion conversacionDao;
    private final DaoMensaje mensajeDao;
    private final DaoUsuario usuarioDao;

    private final MessageList messageList;
    private final MessageInput messageInput;
    private final Long conversacionId;
    private final Long usuarioActualId;

    @SuppressWarnings("CallToPrintStackTrace")
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
                try {
                    enviarMensaje(contenido);
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
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
            item.setUserColorIndex(remitente.getId() % 5 + 1);
            return item;
        }).collect(Collectors.toList());
        messageList.setItems(items);
    }

    private void enviarMensaje(String contenido) throws Exception {
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

    public Conversacion crearConversacion(Integer idEmisor, Integer idReceptor, Integer idAuto) throws Exception {
        Conversacion c = new Conversacion();
        c.setIdEmisor(idEmisor);
        c.setIdReceptor(idReceptor);
        c.setIdAuto(idAuto);
        return conversacionDao.save(c);
    }

    public Conversacion buscarPorId(Long id) {
        return conversacionDao.findById(id);
    }

    @PostMapping("/conversaciones")
    public ResponseEntity<Conversacion> getOrCreateConversacion(@RequestBody ConversacionRequest req) {
        Conversacion conv = ConversacionService.findOrCreate(((Conversacion) req).getIdEmisor(), ((Conversacion) req).getIdReceptor());
        return ResponseEntity.ok(conv);
    }

    public static Conversacion findOrCreate(Integer idEmisor, Integer idReceptor) {
        Conversacion c = new Conversacion();
        c.setIdEmisor(idEmisor);
        c.setIdReceptor(idReceptor);
        return c;
    }
}