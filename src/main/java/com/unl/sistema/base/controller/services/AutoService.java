package com.unl.sistema.base.controller.services;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import com.unl.sistema.base.controller.dao.dao_models.DaoAuto;
import com.unl.sistema.base.models.CategoriaEnum;
import com.unl.sistema.base.models.TipoCombustibleEnum;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class AutoService {
    private DaoAuto da;

    public AutoService() {
        da = new DaoAuto();
    }

    public void create(
            String modelo,
            String anio,
            Integer puertas,
            String color,
            String kilometraje,
            String ciudad,
            String precio,
            String matricula,
            String codigoVIN,
            String descripcion,
            String fechaRegistro,
            Boolean estaDisponible,
            Integer idVenta,
            Integer idMarca,
            String tipoCombustible,
            String categoria) throws Exception {
        if (modelo == null || modelo.trim().isEmpty())
            throw new Exception("El campo 'Modelo' es obligatorio");

        da.getObj().setModelo(modelo);
        da.getObj().setAnio(anio);
        da.getObj().setPuertas(puertas);
        da.getObj().setColor(color);

        // Conversión de kilometraje y precio a Float
        try {
            da.getObj().setKilometraje(
                    kilometraje != null && !kilometraje.isEmpty() ? Float.parseFloat(kilometraje) : null);
        } catch (NumberFormatException e) {
            throw new Exception("Kilometraje inválido");
        }
        da.getObj().setCiudad(ciudad);
        try {
            da.getObj().setPrecio(precio != null && !precio.isEmpty() ? Float.parseFloat(precio) : null);
        } catch (NumberFormatException e) {
            throw new Exception("Precio inválido");
        }
        da.getObj().setMatricula(matricula);
        da.getObj().setCodigoVIN(codigoVIN);
        da.getObj().setDescripcion(descripcion);

        // Conversión de fechaRegistro (String a Date)
        if (fechaRegistro != null && !fechaRegistro.isEmpty()) {
            try {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                da.getObj().setFechaRegistro(sdf.parse(fechaRegistro));
            } catch (Exception e) {
                throw new Exception("Formato de fecha inválido (debe ser yyyy-MM-dd)");
            }
        }

        da.getObj().setEstaDisponible(estaDisponible != null ? estaDisponible : true);
        da.getObj().setIdVenta(idVenta);
        da.getObj().setIdMarca(idMarca);

        // Conversión de enums
        if (tipoCombustible != null && !tipoCombustible.isEmpty())
            da.getObj().setTipoCombustible(TipoCombustibleEnum.valueOf(tipoCombustible));
        if (categoria != null && !categoria.isEmpty())
            da.getObj().setCategoria(CategoriaEnum.valueOf(categoria));

        if (!da.save())
            throw new Exception("No se pudo guardar el auto");
    }

    public List<HashMap<String, String>> ordenar(String atributo, Integer type) {
        return Arrays.asList(da.ordenarString(atributo, type).toArray())
                .stream()
                .map(obj -> da.toDict((com.unl.sistema.base.models.Auto) obj))
                .toList();
    }

    public List<HashMap<String, String>> listAuto() {
        List<HashMap<String, String>> result = new java.util.ArrayList<>();
        int len = da.all().getLength();
        for (int i = 0; i < len; i++) {
            result.add(da.all().get(i));
        }
        return result;
    }

    public String[] getTiposCombustible() {
        return java.util.Arrays.stream(com.unl.sistema.base.models.TipoCombustibleEnum.values()).map(Enum::name)
                .toArray(String[]::new);
    }

    public String[] getCategorias() {
        return java.util.Arrays.stream(com.unl.sistema.base.models.CategoriaEnum.values()).map(Enum::name)
                .toArray(String[]::new);
    }
}