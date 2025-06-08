package com.unl.sistema.base.controller.services;

<<<<<<< HEAD
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import com.unl.sistema.base.controller.dao.dao_models.DaoImagen;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class ImagenService {
    private DaoImagen db;

    public ImagenService() {
        db = new DaoImagen();
    }

    public void create(String url, String descripcion, Integer idAuto) throws Exception {
        if (url == null || url.trim().isEmpty())
            throw new Exception("El campo 'URL' es obligatorio");
        if (descripcion == null || descripcion.trim().isEmpty())
            throw new Exception("El campo 'Descripción' es obligatorio");
        if (idAuto == null)
            throw new Exception("El campo 'ID Auto' es obligatorio");

        db.getObj().setUrl(url);
        db.getObj().setDescripcion(descripcion);
        db.getObj().setIdAuto(idAuto);

        if (!db.save())
            throw new Exception("No se pudo guardar la imagen");
    }

    public List<HashMap<String, String>> ordenar(String atributo, Integer type) {
        return Arrays.asList(db.ordenarString(atributo, type).toArray())
                .stream()
                .map(obj -> db.toDict((com.unl.sistema.base.models.Imagen) obj))
                .toList();
    }

    public List<HashMap<String, String>> listImagen() {
        List<HashMap<String, String>> result = new java.util.ArrayList<>();
        int len = db.all().getLength();
        for (int i = 0; i < len; i++) {
            result.add(db.all().get(i));
        }
        return result;
    }
}
=======
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

>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
