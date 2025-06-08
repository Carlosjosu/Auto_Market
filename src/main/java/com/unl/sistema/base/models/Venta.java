package com.unl.sistema.base.models;

import java.util.Date;

public class Venta {
    private Integer id;
    private Float precioFinal;
    private Date fecha;
    private Integer idAuto;
    private Integer idComprador;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Float getPrecioFinal() {
        return this.precioFinal;
    }

    public void setPrecioFinal(Float precioFinal) {
        this.precioFinal = precioFinal;
    }

    public Date getFecha() {
        return this.fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public Integer getIdAuto() {
        return this.idAuto;
    }

    public void setIdAuto(Integer idAuto) {
        this.idAuto = idAuto;
    }

    public Integer getIdComprador() {
        return this.idComprador;
    }

    public void setIdComprador(Integer idComprador) {
        this.idComprador = idComprador;
    }

   
}