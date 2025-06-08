package com.unl.sistema.base.models;

import java.util.List;

public class Auto {
    private Integer id;
    private String marca;
    private int anio;
    private float precio;
    private float kilometraje;
    private String color;
<<<<<<< HEAD
    private Float kilometraje;
    private String ciudad;
    private Float precio;
    private String matricula;
    private String codigoVIN;
    private String descripcion;
    private Date fechaRegistro;
    private boolean estaDisponible = true;
    private Integer idVenta;
    private Integer idMarca;
=======
	private String matricula;
    private CategoriaEnum categoria;
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
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

<<<<<<< HEAD
    public Float getPrecio() {
        return this.precio;
    }

    public void setPrecio(Float precio) {
        this.precio = precio;
    }
=======
	public void setMatricula(String matricula) {
		this.matricula = matricula;
	}

	public CategoriaEnum getCategoria() {
		return this.categoria;
	}
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)

	public void setCategoria(CategoriaEnum categoria) {
		this.categoria = categoria;
	}

	public TipoCombustibleEnum getTipoCombustible() {
		return this.tipoCombustible;
	}

	public void setTipoCombustible(TipoCombustibleEnum tipoCombustible) {
		this.tipoCombustible = tipoCombustible;
	}

<<<<<<< HEAD
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

    public Integer getIdVenta() {
        return this.idVenta;
    }

    public void setIdVenta(Integer idVenta) {
        this.idVenta = idVenta;
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
        return this.Categoria;
    }

    public void setCategoria(CategoriaEnum Categoria) {
        this.Categoria = Categoria;
    }

=======
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
}