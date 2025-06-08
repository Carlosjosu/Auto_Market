package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import com.unl.sistema.base.controller.dao.dao_models.DaoAuto;
import com.unl.sistema.base.models.Auto;
import com.unl.sistema.base.models.CategoriaEnum;
import com.unl.sistema.base.models.TipoCombustibleEnum;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@BrowserCallable
@AnonymousAllowed

public class AutoService {
    private DaoAuto da;

    public AutoService() {
        da = new DaoAuto();
    }

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
