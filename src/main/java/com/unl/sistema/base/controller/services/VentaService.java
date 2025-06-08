package com.unl.sistema.base.controller.services;

<<<<<<< HEAD
<<<<<<< HEAD
=======
import java.util.ArrayList;
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

<<<<<<< HEAD
import com.unl.sistema.base.controller.dao.dao_models.DaoVenta;
=======
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.controller.dao.dao_models.DaoImagen;
import com.unl.sistema.base.controller.dao.dao_models.DaoPublicacion;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.controller.dao.dao_models.DaoVenta;
import com.unl.sistema.base.models.Publicacion;
import com.unl.sistema.base.models.Usuario;
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======
import com.unl.sistema.base.controller.dao.dao_models.DaoVenta;
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
import com.unl.sistema.base.models.Venta;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.NotEmpty;

=======
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
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
<<<<<<< HEAD
    

    public List<HashMap> listVenta() {
        List<HashMap> lista = new ArrayList<>();
        if (!dv.listAll().isEmpty()) {
            Venta[] arreglo = dv.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("precioVenta", arreglo[i].getPrecioVenta() + "");
                aux.put("fechaVenta", arreglo[i].getFechaVenta().toString());
                aux.put("comprador", new DaoUsuario().listAll().get(arreglo[i].getIdComprador() - 1).getNombre());
                aux.put("publicacion", new DaoPublicacion().listAll().get(arreglo[i].getIdPublicacion() - 1).getTitulo());
                lista.add(aux);
            }
        }
        return lista;
    }
}
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======
}
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
