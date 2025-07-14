package com.unl.sistema.base.controller.services;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.dao.dao_models.DaoFavorito;
import com.unl.sistema.base.models.Favorito;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class FavoritoService {
    private DaoFavorito da;

    public FavoritoService() {
        da = new DaoFavorito();
    }

    public void create(Date fechaGuardado, Integer idAuto, Integer idUsuario) throws Exception {
        if (fechaGuardado != null && idAuto != null && idUsuario != null) {
            da.getObj().setFechaGuardado(fechaGuardado);
            da.getObj().setIdAuto(idAuto);
            da.getObj().setIdUsuario(idUsuario);
            if (!da.save())
                throw new Exception("No se pudo guardar los datos del favorito");
        } else {
            throw new Exception("Todos los campos son obligatorios");
        }
    }

    public void delete(Integer favorito) throws Exception {
        if (!da.delete(favorito)) {
            throw new Exception("No se pudo eliminar el favorito");
        }
    }

    // Ordenar favoritos por atributo y tipo (1: asc, 2: desc)
    public List<Favorito> ordenar(String atributo, Integer type) {
        return Arrays.asList(da.ordenarPorAtributo(atributo, type).toArray());
    }

    // Buscar favoritos por atributo y valor
    public List<Favorito> buscar(String atributo, String valor) {
        return Arrays.asList(da.buscarPorAtributo(atributo, valor).toArray());
    }

    public List<HashMap<String, String>> listFavorito() {
        return Arrays.asList(da.all().toArray());
    }
}