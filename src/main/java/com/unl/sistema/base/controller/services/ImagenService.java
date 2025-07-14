package com.unl.sistema.base.controller.services;

import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import com.unl.sistema.base.controller.dao.dao_models.DaoImagen;
import com.unl.sistema.base.models.Imagen;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class ImagenService {
    private DaoImagen db;

    public ImagenService() {
        db = new DaoImagen();
    }

    public void create(String url, String descripcion, Integer idAuto) throws Exception {
        if (url == null || url.trim().isEmpty())
            throw new Exception("El campo 'URL' es obligatorio");
        if (descripcion == null || descripcion.trim().isEmpty())
            throw new Exception("El campo 'Descripción' es obligatorio");
        if (idAuto == null)
            throw new Exception("El campo 'ID Auto' es obligatorio");

        db.getObj().setUrl(url);
        db.getObj().setDescripcion(descripcion);
        db.getObj().setIdAuto(idAuto);

        if (!db.save())
            throw new Exception("No se pudo guardar la imagen");
    }

    public List<HashMap<String, String>> ordenar(String atributo, Integer type) {
        return Arrays.asList(db.ordenarPorAtributo(atributo, type).toArray());
    }

    public List<HashMap<String, String>> listImagen() {
        List<HashMap<String, String>> result = new java.util.ArrayList<>();
        int len = db.all().getLength();
        for (int i = 0; i < len; i++) {
            result.add(db.all().get(i));
        }
        return result;
    }

    public void asociarImagenesAUnAuto(Integer idAuto, List<Integer> idsImagenes) {
        db.asociarImagenesAUnAuto(idAuto, idsImagenes);
    }

    public HashMap<String, String> buscarPorAtributo(String atributo, String valor) throws Exception {
        return db.buscarPorAtributo(atributo, valor);
    }

    public void marcarComoPrincipal(Integer idImagen, Integer idAuto) throws Exception {
        System.out.println("Marcando imagen " + idImagen + " como principal para auto " + idAuto);

        // Obtener todas las imágenes del auto y procesarlas
        int len = db.all().getLength();
        for (int i = 0; i < len; i++) {
            HashMap<String, String> imgMap = db.all().get(i);
            Integer imgId = Integer.valueOf(imgMap.get("id"));
            Integer autoId = Integer.valueOf(imgMap.get("idAuto"));

            if (autoId.equals(idAuto)) {
                // Encontrar el índice correcto de esta imagen en listAll()
                int correctIndex = -1;
                for (int j = 0; j < db.listAll().getLength(); j++) {
                    if (db.listAll().get(j).getId().equals(imgId)) {
                        correctIndex = j;
                        break;
                    }
                }

                if (correctIndex != -1) {
                    Imagen img = db.listAll().get(correctIndex);
                    if (imgId.equals(idImagen)) {
                        System.out.println("Marcando imagen " + imgId + " como PRINCIPAL");
                        img.setEsPrincipal(true);
                    } else {
                        System.out.println("Marcando imagen " + imgId + " como NO principal");
                        img.setEsPrincipal(false);
                    }
                    db.setObj(img);
                    db.update(correctIndex);
                    System.out.println("Actualizada imagen " + imgId + " en índice " + correctIndex);
                } else {
                    System.out.println("ERROR: No se encontró el índice para imagen " + imgId);
                }
            }
        }
        System.out.println("Finalizado el marcado de imagen principal");
    }
}
