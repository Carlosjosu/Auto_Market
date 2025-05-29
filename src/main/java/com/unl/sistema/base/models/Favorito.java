package com.unl.sistema.base.models;

import java.util.Date;

public class Favorito {
    private Integer id;
    private Date fechaGuardado;
    private Integer idAuto;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getFechaGuardado() {
        return fechaGuardado;
    }

    public void setFechaGuardado(Date fechaGuardado) {
        this.fechaGuardado = fechaGuardado;
    }

    public Integer getIdAuto() {
        return idAuto;
    }

    public void setIdAuto(Integer idAuto) {
        this.idAuto = idAuto;
    }
}