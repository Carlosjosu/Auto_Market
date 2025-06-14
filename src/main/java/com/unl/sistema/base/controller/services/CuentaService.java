package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.dao_models.DaoCuenta;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Marca;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed

public class CuentaService {
    private DaoCuenta dc;
    public CuentaService() {
        dc = new DaoCuenta();
    }

    public void create(@NotEmpty String correo, @NotEmpty String clave) throws Exception{
        if(correo.trim().length() > 0 && clave.trim().length() > 0 ) {
            dc.getObj().setCorreo(correo);
            dc.getObj().setClave(clave);
            if(!dc.save())
                throw new  Exception("No se pudo guardar los datos de la cuenta");
        }
    }

    public void update(Integer id, @NotEmpty String clave) throws Exception{
        if(id !=null && id > 0 && clave.trim().length() > 0 ) {
            dc.setObj(dc.listAll().get(id - 1));
            dc.getObj().setClave(clave);
            if(!dc.save())
                throw new  Exception("No se pudo modificar la clave de la cuenta");
        }
    }

    public List<HashMap> ordenar(String atributo, Integer type) throws Exception{    
        return Arrays.asList(dc.ordenarAtributo(dc.all(), atributo, type).toArray());
    }
    
    public List<HashMap> buscar(String attribute, String text, Integer type) throws Exception {
        LinkedList<HashMap<String, String>> lista = Utiles.busquedaLineal(dc.all(), attribute, text, type);
        if(!lista.isEmpty()){
            return Arrays.asList(lista.toArray());
        } else{
            return new ArrayList<>();
        }
    }

    public List<HashMap> listCuenta() throws Exception {
        return Arrays.asList(dc.all().toArray());
    }
}