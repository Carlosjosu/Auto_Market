package com.unl.sistema.base.models;

import java.util.Date;

public class Conversacion {

    private Integer id;
    private Integer idEmisor;
    private Integer idReceptor;
    private Integer idAuto;
    private Date fechaInicio;
<<<<<<< HEAD
    private boolean estaActiva;

    public Conversacion() {
        this.estaActiva = true;
        this.fechaInicio = new Date();
    }

    public Conversacion(Integer idEmisor, Integer idReceptor, Integer idAuto) {
        this();
        this.idEmisor = idEmisor;
        this.idReceptor = idReceptor;
        this.idAuto = idAuto;
    }

    // Getters y Setters
    public Integer getId() {
        return id;
=======
    private boolean estaActiva = true;

    public Integer getId() {
        return this.id;
>>>>>>> origin/develop
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdEmisor() {
<<<<<<< HEAD
        return idEmisor;
=======
        return this.idEmisor;
>>>>>>> origin/develop
    }

    public void setIdEmisor(Integer idEmisor) {
        this.idEmisor = idEmisor;
    }

    public Integer getIdReceptor() {
<<<<<<< HEAD
        return idReceptor;
=======
        return this.idReceptor;
>>>>>>> origin/develop
    }

    public void setIdReceptor(Integer idReceptor) {
        this.idReceptor = idReceptor;
    }

    public Integer getIdAuto() {
<<<<<<< HEAD
        return idAuto;
=======
        return this.idAuto;
>>>>>>> origin/develop
    }

    public void setIdAuto(Integer idAuto) {
        this.idAuto = idAuto;
    }

    public Date getFechaInicio() {
<<<<<<< HEAD
        return fechaInicio;
=======
        return this.fechaInicio;
>>>>>>> origin/develop
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public boolean isEstaActiva() {
<<<<<<< HEAD
        return estaActiva;
=======
        return this.estaActiva;
>>>>>>> origin/develop
    }

    public void setEstaActiva(boolean estaActiva) {
        this.estaActiva = estaActiva;
    }

<<<<<<< HEAD
    @Override
    public String toString() {
        return "Conversacion{" +
                "id=" + id +
                ", idEmisor=" + idEmisor +
                ", idReceptor=" + idReceptor +
                ", idAuto=" + idAuto +
                ", fechaInicio=" + fechaInicio +
                ", estaActiva=" + estaActiva +
                '}';
    }
=======
    public void setUsuario1(Usuario usuario1) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setUsuario1'");
    }

    public void setUsuario2(Usuario usuario2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setUsuario2'");
    }

>>>>>>> origin/develop
}