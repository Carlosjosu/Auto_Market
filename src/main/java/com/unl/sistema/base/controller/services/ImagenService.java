package com.unl.sistema.base.controller.services;

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
        return Arrays.asList(db.ordenarPorAtributo(atributo, type).toArray());
    }

    public List<HashMap<String, String>> listImagen() {
        List<HashMap<String, String>> result = new java.util.ArrayList<>();
        int len = db.all().getLength();
        for (int i = 0; i < len; i++) {
            result.add(db.all().get(i));
        }
        return result;
    }

    public void asociarImagenesAUnAuto(Integer idAuto, List<Integer> idsImagenes) {
        db.asociarImagenesAUnAuto(idAuto, idsImagenes);
    }

    public HashMap<String, String> buscarPorAtributo(String atributo, String valor) throws Exception {
        return db.buscarPorAtributo(atributo, valor);
    }
}