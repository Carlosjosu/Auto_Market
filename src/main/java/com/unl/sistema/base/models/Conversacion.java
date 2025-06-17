package com.unl.sistema.base.models;

import java.util.Date;

public class Conversacion {

    private Integer id;
    private Integer idEmisor;
    private Integer idReceptor;
    private Integer idAuto;
    private Date fechaInicio;
    private boolean estaActiva = true;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdEmisor() {
        return this.idEmisor;
    }

    public void setIdEmisor(Integer idEmisor) {
        this.idEmisor = idEmisor;
    }

    public Integer getIdReceptor() {
        return this.idReceptor;
    }

    public void setIdReceptor(Integer idReceptor) {
        this.idReceptor = idReceptor;
    }

    public Integer getIdAuto() {
        return this.idAuto;
    }

    public void setIdAuto(Integer idAuto) {
        this.idAuto = idAuto;
    }

    public Date getFechaInicio() {
        return this.fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public boolean isEstaActiva() {
        return this.estaActiva;
    }

    public void setEstaActiva(boolean estaActiva) {
        this.estaActiva = estaActiva;
    }

    
}