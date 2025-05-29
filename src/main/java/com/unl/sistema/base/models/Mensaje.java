package com.unl.sistema.base.models;

import java.util.Date;

public class Mensaje {

    private Integer id;
    private String contenido;
    private Date fechaEnvio;
    private Integer idRemitente;

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
}