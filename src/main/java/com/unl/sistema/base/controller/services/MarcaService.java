package com.unl.sistema.base.controller.services;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.unl.sistema.base.controller.dao.dao_models.DaoMarca;
import com.unl.sistema.base.models.Marca;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed

public class MarcaService {
    private DaoMarca da;

    public MarcaService() {
        da = new DaoMarca();
    }

    public void create(@NotEmpty String nombre, boolean estaActiva) throws Exception {
        if (nombre.trim().length() > 0) {
            da.getObj().setNombre(nombre);
            da.getObj().setEstaActiva(estaActiva);
            if (!da.save())
                throw new Exception("No se pudo guardar los datos de la banda");
        }
    }

    public List<Marca> ordenar(String atributo, Integer type) {
        if (atributo.equalsIgnoreCase("nombre")) {
            return (List<Marca>) Arrays.asList(da.ordenarString(atributo, type).toArray());
        } else {
            return (List<Marca>) Arrays.asList(da.listAll().toArray());
        }
    }

    public List<HashMap<String, String>> listMarca() {
        return Arrays.asList(da.all().toArray());
    }
}