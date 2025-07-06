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

    public List<HashMap<String, String>> ordenar(String atributo, Integer type) {
        return Arrays.asList(da.ordenarPorAtributo(atributo, type).toArray());
    }

    public List<HashMap<String, String>> listMarca() {
        return Arrays.asList(da.all().toArray());
    }

    public HashMap<String, String> buscarPorAtributo(String atributo, String valor) throws Exception {
        return da.buscarPorAtributo(atributo, valor);
    }

    public void update(Integer id, String nombre, boolean estaActiva) throws Exception {
        Marca[] marcas = da.listAll().toArray();
        Marca marcaExistente = null;
        int pos = -1;
        for (int i = 0; i < marcas.length; i++) {
            if (marcas[i].getId().equals(id)) {
                marcaExistente = marcas[i];
                pos = i;
                break;
            }
        }
        if (marcaExistente == null || pos == -1) {
            throw new Exception("Marca no encontrada para editar");
        }
        marcaExistente.setNombre(nombre);
        marcaExistente.setEstaActiva(estaActiva);
        da.setObj(marcaExistente);
        if (!da.update(pos))
            throw new Exception("No se pudo actualizar la marca");
    }
}