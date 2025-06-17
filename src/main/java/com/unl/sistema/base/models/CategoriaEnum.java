package com.unl.sistema.base.models;

public enum CategoriaEnum {
    CAMIONETA("CAMIONETA"), CONVERTIBLE("CONVERTIBLE"), MINIVAN("MINIVAN"), FURGONETA("FURGONETA"),
    DEPORTIVO("DEPORTIVO"), VEHICULO_COMERCIAL("VEHICULO COMERCIAL"), TODO_TERRENO("TODO TERRENO"), CLASICO("CLASICO");

    private String value;

    CategoriaEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

}