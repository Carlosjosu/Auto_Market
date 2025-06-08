package com.unl.sistema.base.models;

public class Imagen {
    private Integer id;
    private String url;
    private String descripcion;
    private Integer idAuto;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getIdAuto() {
        return this.idAuto;
    }

    public void setIdAuto(Integer idAuto) {
        this.idAuto = idAuto;
    }
    
}