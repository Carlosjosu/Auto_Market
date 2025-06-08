package com.unl.sistema.base.models;

import java.util.List;

public class Usuario {
    private Integer id;
    private String nombre;
    private String correo;
    private String contrasenia;
    private Boolean esAdministrador;
    private String telefono;

    public Usuario() {
    }

    public Usuario(String nombre, String apellido, String cedula, String telefono, Integer idCuenta) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.cedula = cedula;
        this.telefono = telefono;
        this.idCuenta = idCuenta;
    }

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
<<<<<<< HEAD

    public Integer getIdCuenta() {
        return this.idCuenta;
    }

    public void setIdCuenta(Integer idCuenta) {
        this.idCuenta = idCuenta;
    }

}
=======
    
}
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
