package com.unl.sistema.base.controller.services;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.dao.dao_models.DaoVenta;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Venta;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import com.unl.sistema.base.controller.Util.Utiles;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class VentaService {
    private DaoVenta da;

    public VentaService() {
        da = new DaoVenta();
    }

    public void create(Float precioFinal, Date fecha, Integer idAuto) throws Exception {
        if (precioFinal != null && fecha != null && idAuto != null) {
            da.getObj().setPrecioFinal(precioFinal);
            da.getObj().setFecha(fecha);
            da.getObj().setIdAuto(idAuto);
            if (!da.save())
                throw new Exception("No se pudo guardar los datos de la venta");
        } else {
            throw new Exception("Todos los campos son obligatorios");
        }
    }

    public void update(Integer id, Float precioFinal, Date fecha, Integer idAuto) throws Exception {
        if (id != null && precioFinal != null && fecha != null && idAuto != null) {
            // Buscar la posición de la venta a editar
            List<Venta> ventas = Arrays.asList(da.listAll().toArray());
            int pos = -1;
            for (int i = 0; i < ventas.size(); i++) {
                if (ventas.get(i).getId() != null && ventas.get(i).getId().equals(id)) {
                    pos = i;
                    break;
                }
            }
            if (pos == -1)
                throw new Exception("Venta no encontrada");

            da.getObj().setPrecioFinal(precioFinal);
            da.getObj().setFecha(fecha);
            da.getObj().setIdAuto(idAuto);

            if (!da.update(pos))
                throw new Exception("No se pudo actualizar la venta");
        } else {
            throw new Exception("Todos los campos son obligatorios");
        }
    }
    
    public List<HashMap<String, String>> buscar(String atributo, String valor) throws Exception {
        return Arrays.asList(da.buscarPorAtributo(atributo, valor).toArray());
    }


    public List<HashMap<String, String>> ordenar(String atributo, int tipo) throws Exception {
        // Obtiene todas las ventas como lista de HashMap
        Object[] objArray = da.all().toArray();
        HashMap<String, String>[] arreglo = new HashMap[objArray.length];
        for (int i = 0; i < objArray.length; i++) {
            arreglo[i] = (HashMap<String, String>) objArray[i];
        }
        // Usa el método de Utiles para ordenar por el atributo y tipo (1=asc, 2=desc)
        Utiles.quickSortHashMap(arreglo, 0, arreglo.length - 1, atributo, tipo);
        // Devuelve la lista ordenada
        return Arrays.asList(arreglo);
    }

    public List<HashMap<String, String>> listVenta() {
        return Arrays.asList(da.all().toArray());
    }
}