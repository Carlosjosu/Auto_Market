package com.unl.sistema.base.controller.services;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.unl.sistema.base.controller.dao.dao_models.DaoImagen;
import com.unl.sistema.base.models.Imagen;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class ImagenService {
    private DaoImagen da;

    public ImagenService() {
        da = new DaoImagen();
    }

    public void create(String url, String descripcion, Integer idAuto) throws Exception {
        if (url != null && !url.isEmpty() && descripcion != null && idAuto != null) {
            da.getObj().setUrl(url);
            da.getObj().setDescripcion(descripcion);
            da.getObj().setIdAuto(idAuto);
            if (!da.save())
                throw new Exception("No se pudo guardar los datos de la imagen");
        } else {
            throw new Exception("Todos los campos son obligatorios");
        }
    }

    public List<HashMap<String, String>> ordenar(String atributo, Integer type) {
        LinkedList<Imagen> lista = da.ordenarString(atributo, type);
        List<HashMap<String, String>> resultado = new java.util.ArrayList<>();
        for (int i = 0; i < lista.getLength(); i++) {
            try {
                resultado.add(da.toDict(lista.get(i)));
            } catch (Exception e) {
            }
        }
        return resultado;
    }

    public List<HashMap<String, String>> listImagen() {
        return Arrays.asList(da.all().toArray());
    }
}