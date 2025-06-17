package com.unl.sistema.base.controller.services;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.unl.sistema.base.controller.dao.dao_models.DaoVenta;
import com.unl.sistema.base.models.Venta;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class VentaService {
    private DaoVenta da;

    public VentaService() {
        da = new DaoVenta();
    }

    public void create(Float precioFinal, Date fecha, Integer idAuto, Integer idComprador) throws Exception {
        if (precioFinal != null && fecha != null && idAuto != null && idComprador != null) {
            da.getObj().setPrecioFinal(precioFinal);
            da.getObj().setFecha(fecha);
            da.getObj().setIdAuto(idAuto);
            da.getObj().setIdComprador(idComprador);
            if (!da.save())
                throw new Exception("No se pudo guardar los datos de la venta");
        } else {
            throw new Exception("Todos los campos son obligatorios");
        }
    }

    public List<Venta> ordenar(String atributo, Integer type) {
        return Arrays.asList(da.ordenarString(atributo, type).toArray());
    }

    public List<HashMap<String, String>> listVenta() {
        return Arrays.asList(da.all().toArray());
    }
}
