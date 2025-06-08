package com.unl.sistema.base.controller.services;

import java.util.Date;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;

import com.unl.sistema.base.controller.dao.dao_models.DaoFavorito;
import com.unl.sistema.base.controller.dao.dao_models.DaoPublicacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.models.Favorito;
import com.unl.sistema.base.models.Publicacion;
import com.unl.sistema.base.models.Usuario;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.PastOrPresent;

@BrowserCallable
@AnonymousAllowed

public class FavoritoService {
    private DaoFavorito df;

    public FavoritoService() {
        df = new DaoFavorito();
    }

    public void create(@PastOrPresent Date fechaMarcado, Integer idUsuario, Integer idPublicacion ) throws Exception {
        if (fechaMarcado.toString().trim().length() > 0 && idPublicacion > 0 && idUsuario > 0) {
            df.getObj().setFechaMarcado(fechaMarcado);
            df.getObj().setIdUsuario(idUsuario); 
            df.getObj().setIdPublicacion(idPublicacion);
            if (!df.save())
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

    public List<HashMap> listaUsuario() {
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

    public List<HashMap> listFavorito() {
        List<HashMap> lista = new ArrayList<>();
        if (!df.listAll().isEmpty()) {
            Favorito[] arreglo = df.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("fechaMarcado", arreglo[i].getFechaMarcado().toString());
                aux.put("Usuario", new DaoUsuario().listAll().get(arreglo[i].getIdUsuario() - 1).getNombre());
                aux.put("Publicacion", new DaoPublicacion().listAll().get(arreglo[i].getIdPublicacion() - 1).getTitulo());
                lista.add(aux);
            }
        }
        return lista;
    }
}

