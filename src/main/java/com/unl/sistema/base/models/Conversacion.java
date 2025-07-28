package com.unl.sistema.base.models;

import java.util.Date;

public class Conversacion {

    private Integer id;
    private Integer idEmisor;
    private Integer idReceptor;
    private Integer idAuto;
    private Date fechaInicio;
    private boolean estaActiva;

    public Conversacion() {
        this.estaActiva = true;
        this.fechaInicio = new Date();
    }

    public Conversacion(Integer idEmisor, Integer idReceptor, Integer idAuto) {
        this();
        this.idEmisor = idEmisor;
        this.idReceptor = idReceptor;
        this.idAuto = idAuto;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdEmisor() {
        return idEmisor;
    }

    public void setIdEmisor(Integer idEmisor) {
        this.idEmisor = idEmisor;
    }

    public Integer getIdReceptor() {
        return idReceptor;
    }

    public void setIdReceptor(Integer idReceptor) {
        this.idReceptor = idReceptor;
    }

    public Integer getIdAuto() {
        return idAuto;
    }

    public void setIdAuto(Integer idAuto) {
        this.idAuto = idAuto;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public boolean isEstaActiva() {
        return estaActiva;
    }

    public void setEstaActiva(boolean estaActiva) {
        this.estaActiva = estaActiva;
    }

    @Override
    public String toString() {
        return "Conversacion{" +
                "id=" + id +
                ", idEmisor=" + idEmisor +
                ", idReceptor=" + idReceptor +
                ", idAuto=" + idAuto +
                ", fechaInicio=" + fechaInicio +
                ", estaActiva=" + estaActiva +
                '}';
    }
}