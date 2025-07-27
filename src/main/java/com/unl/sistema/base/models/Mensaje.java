package com.unl.sistema.base.models;

import java.util.Date;
<<<<<<< HEAD

=======
import org.springframework.stereotype.Repository;

@Repository
>>>>>>> origin/develop
public class Mensaje {

    private Integer id;
    private String contenido;
    private Date fechaEnvio;
    private Integer idRemitente;
    private Integer idConversacion;
<<<<<<< HEAD
    private boolean leido;

    public Mensaje() {
        this.fechaEnvio = new Date();
        this.leido = false;
    }

    public Mensaje(String contenido, Integer idRemitente, Integer idConversacion) {
        this();
        this.contenido = contenido;
        this.idRemitente = idRemitente;
        this.idConversacion = idConversacion;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
=======
    // Agrega este campo si quieres almacenar el objeto Usuario (opcional)
    private Usuario remitente;

    public Integer getId() {
        return this.id;
>>>>>>> origin/develop
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContenido() {
<<<<<<< HEAD
        return contenido;
=======
        return this.contenido;
>>>>>>> origin/develop
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public Date getFechaEnvio() {
<<<<<<< HEAD
        return fechaEnvio;
=======
        return this.fechaEnvio;
>>>>>>> origin/develop
    }

    public void setFechaEnvio(Date fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public Integer getIdRemitente() {
<<<<<<< HEAD
        return idRemitente;
=======
        return this.idRemitente;
>>>>>>> origin/develop
    }

    public void setIdRemitente(Integer idRemitente) {
        this.idRemitente = idRemitente;
    }

    public Integer getIdConversacion() {
<<<<<<< HEAD
        return idConversacion;
=======
        return this.idConversacion;
>>>>>>> origin/develop
    }

    public void setIdConversacion(Integer idConversacion) {
        this.idConversacion = idConversacion;
    }

<<<<<<< HEAD
    public boolean isLeido() {
        return leido;
    }

    public void setLeido(boolean leido) {
        this.leido = leido;
    }

    @Override
    public String toString() {
        return "Mensaje{" +
                "id=" + id +
                ", contenido='" + contenido + '\'' +
                ", fechaEnvio=" + fechaEnvio +
                ", idRemitente=" + idRemitente +
                ", idConversacion=" + idConversacion +
                ", leido=" + leido +
                '}';
    }
=======
    // Getter para remitente
    public Usuario getRemitente() {
        return this.remitente;
    }

    // Setter para remitente
    public void setRemitente(Usuario remitente) {
        this.remitente = remitente;
        if (remitente != null) {
            this.idRemitente = remitente.getId().intValue();
        }
    }

    public void setConversacion(Conversacion conversacion) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

>>>>>>> origin/develop
}