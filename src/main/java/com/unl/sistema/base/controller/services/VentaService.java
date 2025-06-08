package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.controller.dao.dao_models.DaoImagen;
import com.unl.sistema.base.controller.dao.dao_models.DaoPublicacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.controller.dao.dao_models.DaoVenta;
import com.unl.sistema.base.models.Publicacion;
import com.unl.sistema.base.models.Usuario;
import com.unl.sistema.base.models.Venta;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed

public class VentaService {
    private DaoVenta dv;

    public VentaService() {
        dv = new DaoVenta();
    }

    public void create(@Positive float precioVenta, @PastOrPresent Date fechaVenta, Integer idComprador, Integer idPublicacion) throws Exception {
        if (precioVenta > 0 && fechaVenta.toString().trim().length() > 0  && idComprador > 0 && idPublicacion > 0) {
            dv.getObj().setPrecioVenta(precioVenta);
            dv.getObj().setFechaVenta(fechaVenta);
            dv.getObj().setIdComprador(idComprador);
            dv.getObj().setIdPublicacion(idPublicacion);
            if (!dv.save())
                throw new Exception("No se pudo guardar los datos de la banda");
        }
    }

    public List<HashMap> listaPublicacion() {
        List<HashMap> lista = new ArrayList<>();
        DaoPublicacion dp = new DaoPublicacion();
        if (!dp.listAll().isEmpty()) {
            Publicacion[] arreglo = dp.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString(i));
                aux.put("label", arreglo[i].getTitulo());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> listaComprador() {
        List<HashMap> lista = new ArrayList<>();
        DaoUsuario du = new DaoUsuario();
        if (!du.listAll().isEmpty()) {
            Usuario[] arreglo = du.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString(i));
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }
    

    public List<HashMap> listVenta() {
        List<HashMap> lista = new ArrayList<>();
        if (!dv.listAll().isEmpty()) {
            Venta[] arreglo = dv.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("precioVenta", arreglo[i].getPrecioVenta() + "");
                aux.put("fechaVenta", arreglo[i].getFechaVenta().toString());
                aux.put("comprador", new DaoUsuario().listAll().get(arreglo[i].getIdComprador() - 1).getNombre());
                aux.put("publicacion", new DaoPublicacion().listAll().get(arreglo[i].getIdPublicacion() - 1).getTitulo());
                lista.add(aux);
            }
        }
        return lista;
    }
}
