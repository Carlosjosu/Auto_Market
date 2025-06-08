package com.unl.sistema.base.controller.services;

<<<<<<< HEAD
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import com.unl.sistema.base.controller.dao.dao_models.DaoAuto;
=======
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import com.unl.sistema.base.controller.dao.dao_models.DaoAuto;
import com.unl.sistema.base.models.Auto;
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
import com.unl.sistema.base.models.CategoriaEnum;
import com.unl.sistema.base.models.TipoCombustibleEnum;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

<<<<<<< HEAD
@BrowserCallable
@AnonymousAllowed
=======
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@BrowserCallable
@AnonymousAllowed

>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
public class AutoService {
    private DaoAuto da;

    public AutoService() {
        da = new DaoAuto();
    }

<<<<<<< HEAD
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
=======
    public void create(@NotEmpty @Size(max = 50) String marca, @Min(1970) @Max(2025) int anio, @Positive float precio,
            @Positive float kilometraje,
            @NotEmpty @Size(max = 25) String color,
            @NotEmpty @Size(min = 8, max = 8) String matricula, @NotEmpty String categoria,
            @NotEmpty String tipoCombustible) throws Exception {
        if (marca.trim().length() > 0 && anio > 0 && precio > 0 && kilometraje > 0 && color.trim().length() > 0
                && matricula.trim().length() > 0
                && categoria.trim().length() > 0 && tipoCombustible.trim().length() > 0) {
            da.getObj().setMarca(marca);
            da.getObj().setAnio(anio);
            da.getObj().setPrecio(precio);
            da.getObj().setKilometraje(kilometraje);
            da.getObj().setColor(color);
            da.getObj().setMatricula(matricula);
            da.getObj().setCategoria(CategoriaEnum.valueOf(categoria));
            da.getObj().setTipoCombustible(TipoCombustibleEnum.valueOf(tipoCombustible));
            if (!da.save())
                throw new Exception("No se pudo guardar los datos de la banda");
        }
    }

    public List<String> listCategoria() {
        List<String> lista = new ArrayList<>();
        for (CategoriaEnum r : CategoriaEnum.values()) {
            lista.add(r.toString());
        }
        return lista;
    }

    public List<String> listTipoCombustible() {
        List<String> lista = new ArrayList<>();
        for (TipoCombustibleEnum r : TipoCombustibleEnum.values()) {
            lista.add(r.toString());
        }
        return lista;
    }

    public List<HashMap> listAuto() {
        List<HashMap> lista = new ArrayList<>();
        if (!da.listAll().isEmpty()) {
            Auto[] arreglo = da.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("marca", arreglo[i].getMarca());
                aux.put("anio", arreglo[i].getAnio() + "");
                aux.put("precio", arreglo[i].getPrecio() + "");
                aux.put("kilometraje", arreglo[i].getKilometraje() + "");
                aux.put("color", arreglo[i].getColor());
                aux.put("matricula", arreglo[i].getMatricula());
                aux.put("categoria", arreglo[i].getCategoria().toString());
                aux.put("tipoCombustible", arreglo[i].getTipoCombustible().toString());
                lista.add(aux);
            }
        }
        return lista;
    }
}
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
