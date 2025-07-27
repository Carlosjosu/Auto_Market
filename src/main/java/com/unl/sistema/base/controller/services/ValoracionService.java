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

    public void create(Integer puntuacion, String fecha, String comentario, Integer idVenta) throws Exception {
        Valoracion v = new Valoracion();
        v.setPuntuacion(puntuacion);
        // Convierte el string a Date
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
        v.setFecha(sdf.parse(fecha));
        v.setComentario(comentario);
        v.setIdVenta(idVenta);
        if (!da.save(v)) {
            throw new Exception("No se pudo guardar la valoración");
        }
    }

    // Ordenar valoraciones por atributo y tipo (1: asc, 2: desc)
    public List<Valoracion> ordenar(String atributo, Integer type) {
        return Arrays.asList(da.ordenarPorAtributo(atributo, type).toArray());
    }

    // Buscar valoraciones por atributo y valor
    public List<Valoracion> buscar(String atributo, String valor) {
        return Arrays.asList(da.buscarPorAtributo(atributo, valor).toArray());
    }

    public List<HashMap<String, String>> listValoracion() {
        return Arrays.asList(da.all().toArray());
    }
}