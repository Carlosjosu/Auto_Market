package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import com.unl.sistema.base.controller.dao.dao_models.DaoImagen;
import com.unl.sistema.base.controller.dao.dao_models.DaoAuto;
import com.unl.sistema.base.models.Auto;
import com.unl.sistema.base.models.Imagen;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed

public class ImagenService {
    private DaoImagen di;

    public ImagenService() {
        di = new DaoImagen();
    }

    public void create(@NotEmpty String url, @NotEmpty String descripcion, Integer idAuto) throws Exception {
        if (url.trim().length() > 0 && descripcion.trim().length() > 0 && idAuto > 0) {
            di.getObj().setUrl(url);
            di.getObj().setDescripcion(descripcion);;
            di.getObj().setIdAuto(idAuto);; 
            if (!di.save())
                throw new Exception("No se pudo guardar los datos de la banda");
        }
    }

    public List<HashMap> listaAuto() {
        List<HashMap> lista = new ArrayList<>();
        DaoAuto da = new DaoAuto();
        if (!da.listAll().isEmpty()) {
            Auto[] arreglo = da.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString(i));
                aux.put("label", arreglo[i].getMatricula());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> listImagen() {
        List<HashMap> lista = new ArrayList<>();
        if (!di.listAll().isEmpty()) {
            Imagen[] arreglo = di.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("url", arreglo[i].getUrl());
                aux.put("descripcion", arreglo[i].getDescripcion());
                aux.put("auto", new DaoAuto().listAll().get(arreglo[i].getIdAuto() - 1).getMatricula());
                lista.add(aux);
            }
        }
        return lista;
    }
}

