package com.unl.sistema.base.controller.services;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.dao.dao_models.DaoValoracion;
import com.unl.sistema.base.models.Valoracion;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class ValoracionService {
    private DaoValoracion da;
    public ValoracionService() {
        da = new DaoValoracion();
    }

    public void create(Integer puntuacion, Date fecha, String comentario, Integer idVenta) throws Exception {
        if (puntuacion != null && fecha != null && comentario != null && idVenta != null) {
            da.getObj().setPuntuacion(puntuacion);
            da.getObj().setFecha(fecha);
            da.getObj().setComentario(comentario);
            da.getObj().setIdVenta(idVenta);
            if (!da.save())
                throw new Exception("No se pudo guardar los datos de la valoración");
        } else {
            throw new Exception("Todos los campos son obligatorios");
        }
    }

    public List<Valoracion> ordenar(String atributo, Integer type) {
        return Arrays.asList(da.ordenarString(atributo, type).toArray());
    }

    public List<HashMap<String, String>> listValoracion() {
        return Arrays.asList(da.all().toArray());
    }
}