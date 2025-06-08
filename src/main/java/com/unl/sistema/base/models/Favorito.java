package com.unl.sistema.base.models;

import java.util.Date;

public class Favorito{
    private Integer id;
    private Date fechaMarcado;
    private Integer idUsuario;
    private Integer idPublicacion;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getFechaMarcado() {
        return this.fechaMarcado;
    }

    public void setFechaMarcado(Date fechaMarcado) {
        this.fechaMarcado = fechaMarcado;
    }

    public Integer getIdUsuario() {
        return this.idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdPublicacion() {
        return this.idPublicacion;
    }

    public void setIdPublicacion(Integer idPublicacion) {
        this.idPublicacion = idPublicacion;
    }

}