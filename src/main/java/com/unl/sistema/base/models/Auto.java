package com.unl.sistema.base.models;

import java.util.Date;

public class Auto {
    private Integer id;
    private String anio;
    private String modelo;
    private Integer puertas;
    private String color;
    private Float kilometraje;
    private String ciudad;
    private Float precio;
    private String matricula;
    private String codigoVIN;
    private String descripcion;
    private Date fechaRegistro;
    private boolean estaDisponible = true;
    private Integer idVendedor;
    private Integer idMarca;
    private TipoCombustibleEnum tipoCombustible;
    private CategoriaEnum categoria;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAnio() {
        return this.anio;
    }

    public void setAnio(String anio) {
        this.anio = anio;
    }

    public String getModelo() {
        return this.modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getPuertas() {
        return this.puertas;
    }

    public void setPuertas(Integer puertas) {
        this.puertas = puertas;
    }

    public String getColor() {
        return this.color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Float getKilometraje() {
        return this.kilometraje;
    }

    public void setKilometraje(Float kilometraje) {
        this.kilometraje = kilometraje;
    }

    public String getCiudad() {
        return this.ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public Float getPrecio() {
        return this.precio;
    }

    public void setPrecio(Float precio) {
        this.precio = precio;
    }

    public String getMatricula() {
        return this.matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getCodigoVIN() {
        return this.codigoVIN;
    }

    public void setCodigoVIN(String codigoVIN) {
        this.codigoVIN = codigoVIN;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Date getFechaRegistro() {
        return this.fechaRegistro;
    }

    public void setFechaRegistro(Date fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public boolean isEstaDisponible() {
        return this.estaDisponible;
    }

    public void setEstaDisponible(boolean estaDisponible) {
        this.estaDisponible = estaDisponible;
    }

    public Integer getIdVendedor() {
        return this.idVendedor;
    }

    public void setIdVendedor(Integer idVendedor) {
        this.idVendedor = idVendedor;
    }

    public Integer getIdMarca() {
        return this.idMarca;
    }

    public void setIdMarca(Integer idMarca) {
        this.idMarca = idMarca;
    }

    public TipoCombustibleEnum getTipoCombustible() {
        return this.tipoCombustible;
    }

    public void setTipoCombustible(TipoCombustibleEnum tipoCombustible) {
        this.tipoCombustible = tipoCombustible;
    }

    public CategoriaEnum getCategoria() {
        return this.categoria;
    }

    public void setCategoria(CategoriaEnum categoria) {
        this.categoria = categoria;
    }

    public void setCategoriaFromString(String categoriaStr) {
        if (categoriaStr == null) {
            this.categoria = null;
            return;
        }
        for (CategoriaEnum cat : CategoriaEnum.values()) {
            if (cat.getValue().equalsIgnoreCase(categoriaStr)) {
                this.categoria = cat;
                return;
            }
        }

        this.categoria = null;
    }
}