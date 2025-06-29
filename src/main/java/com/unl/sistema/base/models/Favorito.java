package com.unl.sistema.base.models;

import java.util.Date;

public class Favorito {
    private Integer id;
    private Date fechaGuardado;
    private Integer idAuto;
    private Integer idUsuario;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getFechaGuardado() {
        return this.fechaGuardado;
    }

    public void setFechaGuardado(Date fechaGuardado) {
        this.fechaGuardado = fechaGuardado;
    }

    public Integer getIdAuto() {
        return this.idAuto;
    }

    public void setIdAuto(Integer idAuto) {
        this.idAuto = idAuto;
    }

    public Integer getIdUsuario() {
        return this.idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        Favorito other = (Favorito) obj;
        return this.getId() != null && this.getId().equals(other.getId());
    }

}