package com.unl.sistema.base.models;

import java.util.Date;

public class Publicacion {
  
  private Integer id;
  private Date fechaPublicacion;
  private Date fechaFinalizado;
  private Boolean estaActivo;
  private String titulo;
  private String descripcion;
  private EstadoEnum estado;
  private Integer idAuto;
  private Integer idVendedor;

  public Integer getId() {
    return this.id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public Date getFechaPublicacion() {
    return this.fechaPublicacion;
  }

  public void setFechaPublicacion(Date fechaPublicacion) {
    this.fechaPublicacion = fechaPublicacion;
  }

  public Date getFechaFinalizado() {
    return this.fechaFinalizado;
  }

  public void setFechaFinalizado(Date fechaFinalizado) {
    this.fechaFinalizado = fechaFinalizado;
  }

  public Boolean getEstaActivo() {
    return this.estaActivo;
  }

  public void setEstaActivo(Boolean estaActivo) {
    this.estaActivo = estaActivo;
  }

  public String getTitulo() {
    return this.titulo;
  }

  public void setTitulo(String titulo) {
    this.titulo = titulo;
  }

  public String getDescripcion() {
    return this.descripcion;
  }

  public void setDescripcion(String descripcion) {
    this.descripcion = descripcion;
  }

  public EstadoEnum getEstado() {
    return this.estado;
  }

  public void setEstado(EstadoEnum estado) {
    this.estado = estado;
  }

  public Integer getIdAuto() {
    return this.idAuto;
  }

  public void setIdAuto(Integer idAuto) {
    this.idAuto = idAuto;
  }

  public Integer getIdVendedor() {
    return this.idVendedor;
  }

  public void setIdVendedor(Integer idVendedor) {
    this.idVendedor = idVendedor;
  }

}

