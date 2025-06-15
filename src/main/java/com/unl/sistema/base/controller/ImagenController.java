package com.unl.sistema.base.controller;

import com.unl.sistema.base.controller.dao.dao_models.DaoImagen;
import com.unl.sistema.base.models.Imagen;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/imagenes")
public class ImagenController {

    @Autowired
    private DaoImagen daoImagen;

    @GetMapping
    public List<HashMap<String, String>> getAll() {
        // Convertir LinkedList a List manualmente
        List<HashMap<String, String>> result = new java.util.ArrayList<>();
        var linked = daoImagen.all();
        for (int i = 0; i < linked.getLength(); i++) {
            result.add(linked.get(i));
        }
        return result;
    }

    @GetMapping("/auto/{idAuto}")
    public List<HashMap<String, String>> getByAuto(@PathVariable Integer idAuto) {
        List<HashMap<String, String>> result = new java.util.ArrayList<>();
        var linked = daoImagen.all();
        for (int i = 0; i < linked.getLength(); i++) {
            HashMap<String, String> img = linked.get(i);
            if (Integer.valueOf(img.get("idAuto")).equals(idAuto)) {
                result.add(img);
            }
        }
        return result;
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody Imagen imagen) {
        daoImagen.setObj(imagen);
        boolean ok = daoImagen.save();
        return ok ? ResponseEntity.ok().build() : ResponseEntity.status(500).build();
    }

    @PostMapping("/asociar")
    public ResponseEntity<?> asociarImagenes(@RequestParam Integer idAuto, @RequestBody List<Integer> idsImagenes) {
        daoImagen.asociarImagenesAUnAuto(idAuto, idsImagenes);
        return ResponseEntity.ok().build();
    }
}
