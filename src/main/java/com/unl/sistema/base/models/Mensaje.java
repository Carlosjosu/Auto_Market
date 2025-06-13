package com.unl.sistema.base.models;

import java.util.Date;
import org.springframework.stereotype.Repository;

@Repository
public class Mensaje {

    private Integer id;
    private String contenido;
    private Date fechaEnvio;
    private Integer idRemitente;
    private Integer idConversacion;
    // Agrega este campo si quieres almacenar el objeto Usuario (opcional)
    private Usuario remitente;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContenido() {
        return this.contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public Date getFechaEnvio() {
        return this.fechaEnvio;
    }

    public void setFechaEnvio(Date fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public Integer getIdRemitente() {
        return this.idRemitente;
    }

    public void setIdRemitente(Integer idRemitente) {
        this.idRemitente = idRemitente;
    }

    public Integer getIdConversacion() {
        return this.idConversacion;
    }

    public void setIdConversacion(Integer idConversacion) {
        this.idConversacion = idConversacion;
    }

    // Getter para remitente
    public Usuario getRemitente() {
        return this.remitente;
    }

    // Setter para remitente
    public void setRemitente(Usuario remitente) {
        this.remitente = remitente;
        if (remitente != null) {
            this.idRemitente = remitente.getId();
        }
    }

    public void setConversacion(Conversacion conversacion) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

}