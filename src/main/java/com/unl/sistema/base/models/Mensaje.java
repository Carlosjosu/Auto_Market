package com.unl.sistema.base.models;

import java.util.Date;

public class Mensaje {

    private Integer id;
    private String contenido;
    private Date fechaEnvio;
    private Integer idRemitente;
    private Integer idConversacion;
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
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public Date getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(Date fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public Integer getIdRemitente() {
        return idRemitente;
    }

    public void setIdRemitente(Integer idRemitente) {
        this.idRemitente = idRemitente;
    }

    public Integer getIdConversacion() {
        return idConversacion;
    }

    public void setIdConversacion(Integer idConversacion) {
        this.idConversacion = idConversacion;
    }

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
}