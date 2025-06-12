package com.unl.sistema.base.controller.services;

<<<<<<< HEAD
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.unl.sistema.base.controller.dao.dao_models.DaoFavorito;
import com.unl.sistema.base.models.Favorito;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
=======
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unl.sistema.base.models.Favorito;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
>>>>>>> Carlos-ModuloAuto

@BrowserCallable
@Transactional(propagation = Propagation.REQUIRES_NEW)
@AnonymousAllowed
public class FavoritoService {
<<<<<<< HEAD
    private DaoFavorito da;
    public FavoritoService() {
        da = new DaoFavorito();
    }

    public void create(Date fechaGuardado, Integer idAuto, Integer idUsuario) throws Exception {
        if (fechaGuardado != null && idAuto != null && idUsuario != null) {
            da.getObj().setFechaGuardado(fechaGuardado);
            da.getObj().setIdAuto(idAuto);
            da.getObj().setIdUsuario(idUsuario);
            if (!da.save())
                throw new Exception("No se pudo guardar los datos del favorito");
        } else {
            throw new Exception("Todos los campos son obligatorios");
        }
    }

    public List<Favorito> ordenar(String atributo, Integer type) {
        return Arrays.asList(da.ordenarString(atributo, type).toArray());
    }

    public List<HashMap<String, String>> listFavorito() {
        return Arrays.asList(da.all().toArray());
=======
    private static final String FILE_PATH = "src/main/resources/favoritos.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void create(Date fechaGuardado, Integer idAuto, Integer idUsuario) throws Exception {
        if (fechaGuardado == null || idAuto == null || idUsuario == null) {
            throw new Exception("Todos los campos son obligatorios");
        }
        List<Favorito> favoritos = readFavoritos();
        int newId = favoritos.stream().mapToInt(f -> f.getId() != null ? f.getId() : 0).max().orElse(0) + 1;
        Favorito nuevo = new Favorito(fechaGuardado, idAuto, idUsuario);
        nuevo.setId(newId);
        favoritos.add(nuevo);
        writeFavoritos(favoritos);
    }

    public List<Favorito> listFavorito() throws Exception {
        return readFavoritos();
    }

    private List<Favorito> readFavoritos() throws Exception {
        File file = new File(FILE_PATH);
        if (!file.exists())
            return new ArrayList<>();
        return objectMapper.readValue(file, new TypeReference<List<Favorito>>() {
        });
    }

    private void writeFavoritos(List<Favorito> favoritos) throws Exception {
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(new File(FILE_PATH), favoritos);
>>>>>>> Carlos-ModuloAuto
    }
}