package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Date;

import com.unl.sistema.base.controller.dao.dao_models.DaoAuto;
import com.unl.sistema.base.controller.dao.dao_models.DaoPublicacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.models.Auto;
import com.unl.sistema.base.models.Publicacion;
import com.unl.sistema.base.models.Usuario;
import com.unl.sistema.base.models.EstadoEnum;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed
public class PublicacionService {
    private DaoPublicacion dp;

    public PublicacionService() {
        dp = new DaoPublicacion();
    }

    public void create(Date fechaPublicacion, @NotEmpty String titulo, @NotEmpty String descripcion,
            @NotEmpty String estado, Integer idAuto, Integer idVendedor) throws Exception {
        if (fechaPublicacion != null && titulo.trim().length() > 0 && descripcion.trim().length() > 0
                && estado.trim().length() > 0 && idAuto > 0 && idVendedor > 0) {
            dp.getObj().setFechaPublicacion(fechaPublicacion);
            dp.getObj().setFechaFinalizado(null);
            dp.getObj().setEstaActivo(true);
            dp.getObj().setTitulo(titulo);
            dp.getObj().setDescripcion(descripcion);
            dp.getObj().setEstado(EstadoEnum.valueOf(estado));
            dp.getObj().setIdAuto(idAuto);
            dp.getObj().setIdVendedor(idVendedor);
            if (!dp.save())
                throw new Exception("No se pudo guardar los datos de la publicación");
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

    public List<HashMap> listaVendedor() {
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

    public List<String> listEstado() {
        List<String> lista = new ArrayList<>();
        for (EstadoEnum r : EstadoEnum.values()) {
            lista.add(r.toString());
        }
        return lista;
    }

    public List<HashMap> listPublicacion() {
        List<HashMap> lista = new ArrayList<>();
        if (!dp.listAll().isEmpty()) {
            Publicacion[] arreglo = dp.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("fechaPublicacion",
                        arreglo[i].getFechaPublicacion() != null ? arreglo[i].getFechaPublicacion().toString() : "");
                aux.put("fechaFinalizado",
                        arreglo[i].getFechaFinalizado() != null ? arreglo[i].getFechaFinalizado().toString()
                                : "No Finalizada");
                aux.put("estaActivo", arreglo[i].getEstaActivo() != null ? arreglo[i].getEstaActivo().toString() : "");
                aux.put("titulo", arreglo[i].getTitulo());
                aux.put("descripcion", arreglo[i].getDescripcion());
                aux.put("estado", arreglo[i].getEstado() != null ? arreglo[i].getEstado().toString() : "");
                aux.put("auto", new DaoAuto().listAll().get(arreglo[i].getIdAuto() - 1).getMatricula());
                aux.put("vendedor", new DaoUsuario().listAll().get(arreglo[i].getIdVendedor() - 1).getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }
}