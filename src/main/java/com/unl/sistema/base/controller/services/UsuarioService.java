package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.dao_models.DaoCuenta;
import com.unl.sistema.base.controller.dao.dao_models.DaoRol;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Cuenta;
import com.unl.sistema.base.models.Rol;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed

public class UsuarioService {

    private DaoUsuario du;

    public UsuarioService() {
        du = new DaoUsuario();
    }

    public void create(@NotEmpty String nickname, @NotEmpty String nombre, @NotEmpty String apellido,
            @NotEmpty String cedula, @NotEmpty String telefono, Integer idCuenta, Integer idRol) throws Exception {
        if (nickname.trim().length() > 0 && nombre.trim().length() > 0 && apellido.trim().length() > 0
                && cedula.trim().length() > 0
                && telefono.trim().length() > 0 && idCuenta > 0 && idRol > 0) {
            du.getObj().setNickname(nickname);
            du.getObj().setNombre(nombre);
            du.getObj().setApellido(apellido);
            du.getObj().setCedula(cedula);
            du.getObj().setTelefono(telefono);
            du.getObj().setIdCuenta(idCuenta);
            du.getObj().setIdRol(idRol);
            if (!du.save())
                throw new Exception("No se pudo guardar los datos del usuario");
        }
    }

    public void update(Integer id, @NotEmpty String nickname, @NotEmpty String nombre, @NotEmpty String apellido,
            @NotEmpty String cedula, @NotEmpty String telefono) throws Exception {
        if (id != null && id > 0 && nickname.trim().length() > 0 && nombre.trim().length() > 0
                && apellido.trim().length() > 0
                && cedula.trim().length() > 0 && telefono.trim().length() > 0) {
            du.setObj(du.listAll().get(id - 1));
            du.getObj().setNickname(nickname);
            du.getObj().setNombre(nombre);
            du.getObj().setApellido(apellido);
            du.getObj().setCedula(cedula);
            du.getObj().setTelefono(telefono);
            if (!du.update(id - 1))
                throw new Exception("No se pudo modificar los datos del usuario");
        }
    }

    public List<HashMap> listaCuenta() {
        List<HashMap> lista = new ArrayList<>();
        DaoCuenta db = new DaoCuenta();
        if (!db.listAll().isEmpty()) {
            Cuenta[] arreglo = db.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getCorreo());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> listaRol() {
        List<HashMap> lista = new ArrayList<>();
        DaoRol dr = new DaoRol();
        if (!dr.listAll().isEmpty()) {
            Rol[] arreglo = dr.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
            }
        }
        return lista;
    }

    public List<HashMap> ordenar(String atributo, Integer type) {
        return Arrays.asList(du.ordenarAtributo(du.all(), atributo, type).toArray());
    }

    public List<HashMap> buscar(String attribute, String text, Integer type) throws Exception {
        LinkedList<HashMap<String, String>> lista = Utiles.busquedaLineal(du.all(), attribute, text, type);
        if (!lista.isEmpty()) {
            return Arrays.asList(lista.toArray());
        } else {
            return new ArrayList<>();
        }
    }

    public List<HashMap> listUsuario() {
        return Arrays.asList(du.all().toArray());
    }

}