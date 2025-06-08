package com.unl.sistema.base.controller.services;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.dao.dao_models.DaoAuto;
import com.unl.sistema.base.models.Auto;
import com.unl.sistema.base.models.TipoCombustibleEnum;
import com.unl.sistema.base.models.CategoriaEnum;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class AutoService {
    private DaoAuto da;

    public AutoService() {
        da = new DaoAuto();
    }

    public void create(String anio, String modelo, Integer puertas, String color, Float kilometraje, String ciudad,
            Float precio, String matricula, String codigoVIN, String descripcion, java.util.Date fechaRegistro,
            Boolean estaDisponible, Integer idVendedor, Integer idMarca, String tipoCombustible, String categoria)
            throws Exception {
        if (anio != null && !anio.isEmpty() && modelo != null && !modelo.isEmpty() && puertas != null && color != null
                && kilometraje != null && ciudad != null && precio != null && matricula != null && codigoVIN != null
                && descripcion != null && fechaRegistro != null && estaDisponible != null && idVendedor != null
                && idMarca != null && tipoCombustible != null && categoria != null) {
            da.getObj().setAnio(anio);
            da.getObj().setModelo(modelo);
            da.getObj().setPuertas(puertas);
            da.getObj().setColor(color);
            da.getObj().setKilometraje(kilometraje);
            da.getObj().setCiudad(ciudad);
            da.getObj().setPrecio(precio);
            da.getObj().setMatricula(matricula);
            da.getObj().setCodigoVIN(codigoVIN);
            da.getObj().setDescripcion(descripcion);
            da.getObj().setFechaRegistro(fechaRegistro);
            da.getObj().setEstaDisponible(estaDisponible);
            da.getObj().setIdVendedor(idVendedor);
            da.getObj().setIdMarca(idMarca);
            da.getObj().setTipoCombustible(TipoCombustibleEnum.valueOf(tipoCombustible));
            da.getObj().setCategoria(CategoriaEnum.valueOf(categoria));
            if (!da.save())
                throw new Exception("No se pudo guardar los datos del auto");
        } else {
            throw new Exception("Todos los campos son obligatorios");
        }
    }

    public List<Auto> ordenar(String atributo, Integer type) {
        return Arrays.asList(da.ordenarString(atributo, type).toArray());
    }

    public List<HashMap<String, String>> listAuto() {
        return Arrays.asList(da.all().toArray());
    }

    public List<String> getTipoCombustibleOptions() {
        return Arrays.stream(TipoCombustibleEnum.values())
                .map(Enum::name)
                .toList();
    }

    public List<String> getCategoriaOptions() {
        return Arrays.stream(CategoriaEnum.values())
                .map(Enum::name)
                .toList();
    }
}