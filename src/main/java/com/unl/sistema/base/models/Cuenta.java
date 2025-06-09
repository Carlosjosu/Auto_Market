package com.unl.sistema.base.models;

public class Cuenta {
    private Integer id;
    private String correo;
    private String clave;

    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getCorreo() {
        return correo;
    }
    
    public void setCorreo(String correo) {
        this.correo = correo;
    }
    
    public String getClave() {
        return this.clave;
    }
    
    public void setClave(String clave) {
        this.clave = clave;
    }
}
