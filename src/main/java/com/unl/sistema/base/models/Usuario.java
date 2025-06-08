package com.unl.sistema.base.models;

import java.util.List;

public class Usuario {
    private Integer id;
    private String nombre;
    private String correo;
    private String contrasenia;
    private Boolean esAdministrador;
    private String telefono;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return this.correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasenia() {
        return this.contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    public Boolean getEsAdministrador() {
        return this.esAdministrador;
    }

    public void setEsAdministrador(Boolean esAdministrador) {
        this.esAdministrador = esAdministrador;
    }

    public String getTelefono() {
        return this.telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
    
}
