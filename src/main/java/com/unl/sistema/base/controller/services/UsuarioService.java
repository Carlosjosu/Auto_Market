package com.unl.sistema.base.controller.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
<<<<<<< HEAD
import java.util.Locale;
=======
>>>>>>> origin/develop

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.dao_models.DaoCuenta;
import com.unl.sistema.base.controller.dao.dao_models.DaoRol;
import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Cuenta;
<<<<<<< HEAD
import com.unl.sistema.base.models.Marca;
=======
>>>>>>> origin/develop
import com.unl.sistema.base.models.Rol;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

import jakarta.validation.constraints.NotEmpty;
<<<<<<< HEAD
import jakarta.validation.constraints.Size;
=======
>>>>>>> origin/develop

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed

public class UsuarioService {
<<<<<<< HEAD
    private DaoUsuario du;
=======

    private DaoUsuario du;

>>>>>>> origin/develop
    public UsuarioService() {
        du = new DaoUsuario();
    }

<<<<<<< HEAD
    public void create(@NotEmpty String nickname, @NotEmpty String nombre, @NotEmpty String apellido, 
                        @NotEmpty String cedula, @NotEmpty String telefono, Integer idCuenta, Integer idRol) throws Exception{
        if(nickname.trim().length() > 0 && nombre.trim().length() > 0 && apellido.trim().length() > 0 && cedula.trim().length() > 0 
            && telefono.trim().length() > 0 && idCuenta > 0 && idRol > 0) {
=======
    public void create(@NotEmpty String nickname, @NotEmpty String nombre, @NotEmpty String apellido,
            @NotEmpty String cedula, @NotEmpty String telefono, Integer idCuenta, Integer idRol) throws Exception {
        if (nickname.trim().length() > 0 && nombre.trim().length() > 0 && apellido.trim().length() > 0
                && cedula.trim().length() > 0
                && telefono.trim().length() > 0 && idCuenta > 0 && idRol > 0) {
>>>>>>> origin/develop
            du.getObj().setNickname(nickname);
            du.getObj().setNombre(nombre);
            du.getObj().setApellido(apellido);
            du.getObj().setCedula(cedula);
            du.getObj().setTelefono(telefono);
            du.getObj().setIdCuenta(idCuenta);
            du.getObj().setIdRol(idRol);
<<<<<<< HEAD
            if(!du.save())
                throw new  Exception("No se pudo guardar los datos del usuario");
        }
    }

    public void update(Integer id, @NotEmpty String nickname, @NotEmpty String nombre, @NotEmpty String apellido, 
                        @NotEmpty String cedula, @NotEmpty String telefono) throws Exception{
        if(id !=null && id > 0 && nickname.trim().length() > 0 && nombre.trim().length() > 0 && apellido.trim().length() > 0 
            && cedula.trim().length() > 0 && telefono.trim().length() > 0 ) {
=======
            if (!du.save())
                throw new Exception("No se pudo guardar los datos del usuario");
        }
    }

    public void update(Integer id, @NotEmpty String nickname, @NotEmpty String nombre, @NotEmpty String apellido,
            @NotEmpty String cedula, @NotEmpty String telefono) throws Exception {
        if (id != null && id > 0 && nickname.trim().length() > 0 && nombre.trim().length() > 0
                && apellido.trim().length() > 0
                && cedula.trim().length() > 0 && telefono.trim().length() > 0) {
>>>>>>> origin/develop
            du.setObj(du.listAll().get(id - 1));
            du.getObj().setNickname(nickname);
            du.getObj().setNombre(nombre);
            du.getObj().setApellido(apellido);
            du.getObj().setCedula(cedula);
            du.getObj().setTelefono(telefono);
<<<<<<< HEAD
            if(!du.update(id - 1))
                throw new  Exception("No se pudo modificar los datos del usuario");
        }
    }
    
    public List<HashMap> listaCuenta() {
        List<HashMap> lista = new ArrayList<>();
        DaoCuenta db = new DaoCuenta();
        if(!db.listAll().isEmpty()) {
            Cuenta [] arreglo = db.listAll().toArray();
            for(int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString()); 
                aux.put("label", arreglo[i].getCorreo()); 
                lista.add(aux);  
=======
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
>>>>>>> origin/develop
            }
        }
        return lista;
    }

    public List<HashMap> listaRol() {
        List<HashMap> lista = new ArrayList<>();
        DaoRol dr = new DaoRol();
<<<<<<< HEAD
        if(!dr.listAll().isEmpty()) {
            Rol [] arreglo = dr.listAll().toArray();
            for(int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString()); 
                aux.put("label", arreglo[i].getNombre()); 
                lista.add(aux);  
=======
        if (!dr.listAll().isEmpty()) {
            Rol[] arreglo = dr.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("value", arreglo[i].getId().toString());
                aux.put("label", arreglo[i].getNombre());
                lista.add(aux);
>>>>>>> origin/develop
            }
        }
        return lista;
    }

<<<<<<< HEAD
    public List<HashMap> ordenar(String atributo, Integer type){    
=======
    public List<HashMap> ordenar(String atributo, Integer type) {
>>>>>>> origin/develop
        return Arrays.asList(du.ordenarAtributo(du.all(), atributo, type).toArray());
    }

    public List<HashMap> buscar(String attribute, String text, Integer type) throws Exception {
<<<<<<< HEAD
        LinkedList<HashMap<String,String>> lista = Utiles.busquedaLineal(du.all(), attribute, text, type);
        if(!lista.isEmpty()){
            return Arrays.asList(lista.toArray());
        } else{
            return new ArrayList<>();
        }
    }
    
=======
        LinkedList<HashMap<String, String>> lista = Utiles.busquedaLineal(du.all(), attribute, text, type);
        if (!lista.isEmpty()) {
            return Arrays.asList(lista.toArray());
        } else {
            return new ArrayList<>();
        }
    }

>>>>>>> origin/develop
    public List<HashMap> listUsuario() {
        return Arrays.asList(du.all().toArray());
    }

}