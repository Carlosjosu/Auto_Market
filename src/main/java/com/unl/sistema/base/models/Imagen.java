package com.unl.sistema.base.models;

public class Imagen {

    private Integer id;
    private String url;
    private String descripcion;
    private Integer idAuto;
    private Boolean esPrincipal;

    public Imagen() {
        this.esPrincipal = false; // Inicializar como false por defecto
    }

    public Imagen(String url, String descripcion, Integer idAuto) {
        this.url = url;
        this.descripcion = descripcion;
        this.idAuto = idAuto;
        this.esPrincipal = false; // Inicializar como false por defecto
    }

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

    public Boolean getEsPrincipal() {
        return this.esPrincipal;
    }

    public void setEsPrincipal(Boolean esPrincipal) {
        this.esPrincipal = esPrincipal;
    }
}
