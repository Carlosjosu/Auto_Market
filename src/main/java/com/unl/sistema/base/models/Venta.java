package com.unl.sistema.base.models;

import java.util.Date;

public class Venta {
    private Integer id;
    private float precioVenta;
    private Date fechaVenta;
    private Integer idComprador;
    private Integer idPublicacion;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public float getPrecioVenta() {
        return this.precioVenta;
    }

    public void setPrecioVenta(float precioVenta) {
        this.precioVenta = precioVenta;
    }

    public Date getFechaVenta() {
        return this.fechaVenta;
    }

    public void setFechaVenta(Date fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public Integer getIdComprador() {
        return this.idComprador;
    }

    public void setIdComprador(Integer idComprador) {
        this.idComprador = idComprador;
    }

    public Integer getIdPublicacion() {
        return this.idPublicacion;
    }

    public void setIdPublicacion(Integer idPublicacion) {
        this.idPublicacion = idPublicacion;
    }

}

