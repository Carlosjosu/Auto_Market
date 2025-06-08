package com.unl.sistema.base.models;

import java.util.List;

public class Auto {
    private Integer id;
    private String marca;
    private int anio;
    private float precio;
    private float kilometraje;
    private String color;
	private String matricula;
    private CategoriaEnum categoria;
    private TipoCombustibleEnum tipoCombustible;


	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMarca() {
		return this.marca;
	}

	public void setMarca(String marca) {
		this.marca = marca;
	}

	public int getAnio() {
		return this.anio;
	}

	public void setAnio(int anio) {
		this.anio = anio;
	}

	public float getPrecio() {
		return this.precio;
	}

	public void setPrecio(float precio) {
		this.precio = precio;
	}

	public float getKilometraje() {
		return this.kilometraje;
	}

	public void setKilometraje(float kilometraje) {
		this.kilometraje = kilometraje;
	}

	public String getColor() {
		return this.color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getMatricula() {
		return this.matricula;
	}

	public void setMatricula(String matricula) {
		this.matricula = matricula;
	}

	public CategoriaEnum getCategoria() {
		return this.categoria;
	}

	public void setCategoria(CategoriaEnum categoria) {
		this.categoria = categoria;
	}

	public TipoCombustibleEnum getTipoCombustible() {
		return this.tipoCombustible;
	}

	public void setTipoCombustible(TipoCombustibleEnum tipoCombustible) {
		this.tipoCombustible = tipoCombustible;
	}

}