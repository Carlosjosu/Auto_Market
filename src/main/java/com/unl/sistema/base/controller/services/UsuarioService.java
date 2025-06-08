package com.unl.sistema.base.controller.services;

import java.util.Date;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import java.util.Locale;

import org.springframework.data.domain.Pageable;

import com.unl.sistema.base.controller.dao.dao_models.DaoUsuario;
import com.unl.sistema.base.models.Usuario;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotEmpty;

@BrowserCallable
@AnonymousAllowed

public class UsuarioService {
    private DaoUsuario du;

    public UsuarioService() {
        du = new DaoUsuario();
    }

    public void create(@NotEmpty @Size(max = 50) String nombre, @NotEmpty @Size(max = 100) String correo,
            @NotEmpty @Size(min = 8, max = 8) String contrasenia,
            @NotEmpty @Size(min = 10, max = 10) String telefono) throws Exception {
        if (nombre.trim().length() > 0 && correo.trim().length() > 0 && contrasenia.trim().length() > 0 &&
                telefono.trim().length() > 0) {
            du.getObj().setNombre(nombre);
            du.getObj().setCorreo(correo);
            du.getObj().setContrasenia(contrasenia);
            du.getObj().setEsAdministrador(false);
            du.getObj().setTelefono(telefono);
            if (!du.save())
                throw new Exception("No se pudo guardar los datos de la banda");
        }
    }

    public List<HashMap> listUsuario() {
        List<HashMap> lista = new ArrayList<>();
        if (!du.listAll().isEmpty()) {
            Usuario[] arreglo = du.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                HashMap<String, String> aux = new HashMap<>();
                aux.put("id", arreglo[i].getId().toString(i));
                aux.put("nombre", arreglo[i].getNombre());
                aux.put("correo", arreglo[i].getCorreo());
                aux.put("contrasenia", arreglo[i].getContrasenia());
                aux.put("esAdministrador", arreglo[i].getEsAdministrador().toString());
                aux.put("telefono", arreglo[i].getTelefono());
                lista.add(aux);
            }
        }
        return lista;
    }
}
