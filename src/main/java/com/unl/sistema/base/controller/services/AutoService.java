package com.unl.sistema.base.controller.services;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import com.unl.sistema.base.controller.dao.dao_models.DaoAuto;
import com.unl.sistema.base.models.CategoriaEnum;
import com.unl.sistema.base.models.TipoCombustibleEnum;
import com.unl.sistema.base.controller.Util.Utiles;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.hilla.BrowserCallable;

@BrowserCallable
@AnonymousAllowed
public class AutoService {
    private DaoAuto da;

    public AutoService() {
        da = new DaoAuto();
    }

    public void create(
            String modelo,
            String anio,
            Integer puertas,
            String color,
            String kilometraje,
            String ciudad,
            Float precio,
            String matricula,
            String codigoVIN,
            String descripcion,
            Date fechaRegistro,
            Boolean estaDisponible,
            Integer idVendedor,
            Integer idMarca,
            String tipoCombustible,
            String categoria) throws Exception {
        if (modelo == null || modelo.trim().isEmpty())
            throw new Exception("El campo 'Modelo' es obligatorio");
        da.getObj().setModelo(modelo);
        da.getObj().setAnio(anio);
        da.getObj().setPuertas(puertas);
        da.getObj().setColor(color);
        try {
            da.getObj().setKilometraje(
                    kilometraje != null && !kilometraje.isEmpty() ? Float.parseFloat(kilometraje) : null);
        } catch (NumberFormatException e) {
            throw new Exception("Kilometraje inválido");
        }
        da.getObj().setCiudad(ciudad);
        da.getObj().setPrecio(precio);
        da.getObj().setMatricula(matricula);
        da.getObj().setCodigoVIN(codigoVIN);
        da.getObj().setDescripcion(descripcion);
        if (fechaRegistro != null) {
            da.getObj().setFechaRegistro(fechaRegistro);
        }
        da.getObj().setEstaDisponible(estaDisponible != null ? estaDisponible : true);
        da.getObj().setIdVendedor(idVendedor);
        da.getObj().setIdMarca(idMarca);
        if (tipoCombustible != null && !tipoCombustible.isEmpty())
            da.getObj().setTipoCombustible(TipoCombustibleEnum.valueOf(tipoCombustible));
        if (categoria != null && !categoria.isEmpty())
            da.getObj().setCategoria(CategoriaEnum.valueOf(categoria));
        if (!da.save())
            throw new Exception("No se pudo guardar el auto");
    }

    public void updateAuto(
            Integer id,
            String modelo,
            String anio,
            Integer puertas,
            String color,
            String kilometraje,
            String ciudad,
            Float precio,
            String matricula,
            String codigoVIN,
            String descripcion,
            Date fechaRegistro,
            Boolean estaDisponible,
            Integer idVendedor,
            Integer idMarca,
            String tipoCombustible,
            String categoria) throws Exception {

        com.unl.sistema.base.models.Auto autoExistente = null;
        int pos = -1;
        com.unl.sistema.base.models.Auto[] autos = da.listAll().toArray();
        for (int i = 0; i < autos.length; i++) {
            if (autos[i].getId() == id) {
                autoExistente = autos[i];
                pos = i;
                break;
            }
        }
        if (autoExistente == null || pos == -1) {
            throw new Exception("Auto no encontrado para editar");
        }
        autoExistente.setModelo(modelo);
        autoExistente.setAnio(anio);
        autoExistente.setPuertas(puertas);
        try {
            autoExistente.setKilometraje(
                    kilometraje != null && !kilometraje.isEmpty() ? Float.parseFloat(kilometraje) : null);
        } catch (NumberFormatException e) {
            throw new Exception("Kilometraje inválido");
        }
        autoExistente.setColor(color);
        autoExistente.setCiudad(ciudad);
        autoExistente.setPrecio(precio);
        autoExistente.setMatricula(matricula);
        autoExistente.setCodigoVIN(codigoVIN);
        autoExistente.setDescripcion(descripcion);
        if (fechaRegistro != null) {
            autoExistente.setFechaRegistro(fechaRegistro);
        }
        autoExistente.setEstaDisponible(estaDisponible != null ? estaDisponible : true);
        autoExistente.setIdVendedor(idVendedor);
        autoExistente.setIdMarca(idMarca);
        if (tipoCombustible != null && !tipoCombustible.isEmpty())
            autoExistente.setTipoCombustible(TipoCombustibleEnum.valueOf(tipoCombustible));
        if (categoria != null && !categoria.isEmpty())
            autoExistente.setCategoria(CategoriaEnum.valueOf(categoria));
        da.setObj(autoExistente);
        if (!da.update(pos))
            throw new Exception("No se pudo actualizar el auto");
    }

    public List<HashMap<String, String>> ordenar(String atributo, Integer type) {
        return Arrays.asList(da.ordenarPorAtributo(atributo, type).toArray());
    }

    public List<HashMap<String, String>> listAuto() {
        List<HashMap<String, String>> result = new java.util.ArrayList<>();
        int len = da.all().getLength();
        if (len > 0) {
            HashMap<String, String>[] arr = new HashMap[len];
            for (int i = 0; i < len; i++) {
                arr[i] = da.all().get(i);
            }
            Utiles.knuthShuffle(arr);
            for (HashMap<String, String> item : arr) {
                result.add(item);
            }
        }
        return result;
    }

    public String[] getTiposCombustible() {
        return Arrays.stream(TipoCombustibleEnum.values()).map(Enum::name)
                .toArray(String[]::new);
    }

    public String[] getCategoriasLegibles() {
        return Arrays.stream(CategoriaEnum.values())
                .map(CategoriaEnum::getValue)
                .toArray(String[]::new);
    }

    public HashMap<String, String> buscarPorAtributo(String atributo, String valor) throws Exception {
        return da.buscarPorAtributo(atributo, valor);
    }

    /**
     * Lista todos los autos del vendedor especificado
     */
    public List<HashMap<String, String>> listAutosByVendedor(Integer idVendedor) {
        List<HashMap<String, String>> result = new java.util.ArrayList<>();
        if (idVendedor == null)
            return result;

        int len = da.all().getLength();
        for (int i = 0; i < len; i++) {
            HashMap<String, String> auto = da.all().get(i);
            if (auto.get("idVendedor") != null &&
                    auto.get("idVendedor").equals(idVendedor.toString())) {
                result.add(auto);
            }
        }
        return result;
    }

    /**
     * Lista todos los autos disponibles excluyendo los del vendedor especificado
     * (para el modo comprador)
     */
    public List<HashMap<String, String>> listAutosForComprador(Integer idVendedor) {
        List<HashMap<String, String>> result = new java.util.ArrayList<>();

        int len = da.all().getLength();
        for (int i = 0; i < len; i++) {
            HashMap<String, String> auto = da.all().get(i);
            // Solo mostrar autos disponibles que no sean del usuario actual
            boolean estaDisponible = "true".equals(auto.get("estaDisponible"));
            boolean noEsDelVendedor = !auto.get("idVendedor").equals(idVendedor.toString());

            if (estaDisponible && noEsDelVendedor) {
                result.add(auto);
            }
        }

        // Mezclar los resultados para variedad
        if (!result.isEmpty()) {
            HashMap<String, String>[] arr = result.toArray(new HashMap[0]);
            Utiles.knuthShuffle(arr);
            result = Arrays.asList(arr);
        }

        return result;
    }

    /**
     * Verifica si el auto pertenece al vendedor especificado
     */
    public Boolean esAutoDelVendedor(Integer idAuto, Integer idVendedor) {
        if (idAuto == null || idVendedor == null)
            return false;

        try {
            HashMap<String, String> auto = da.buscarPorAtributo("id", idAuto.toString());
            if (auto != null) {
                return idVendedor.toString().equals(auto.get("idVendedor"));
            }
        } catch (Exception e) {
            System.err.println("Error verificando propietario del auto: " + e.getMessage());
        }
        return false;
    }

    /**
     * Búsqueda flexible por modelo (contiene, insensible a mayúsculas/minúsculas)
     */
    public List<HashMap<String, String>> buscarPorModeloFlexible(String texto) throws Exception {
        // type = 0 para búsqueda en cualquier parte del texto
        // Convertir el LinkedList a un List estándar
        com.unl.sistema.base.controller.datastruct.list.LinkedList<HashMap<String, String>> resultado = Utiles.busquedaLineal(da.all(), "modelo", texto, 0);
        java.util.List<HashMap<String, String>> lista = new java.util.ArrayList<>();
        for (int i = 0; i < resultado.getLength(); i++) {
            lista.add(resultado.get(i));
        }
        return lista;
    }
}
