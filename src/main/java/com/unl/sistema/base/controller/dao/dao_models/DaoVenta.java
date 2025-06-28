package com.unl.sistema.base.controller.dao.dao_models;

<<<<<<< HEAD
import java.util.HashMap;
import com.unl.sistema.base.controller.Util.Utiles;
=======
import java.util.Date;
import java.util.HashMap;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

>>>>>>> origin/feature/Sebas-ModuloValoracion
import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Auto;
import com.unl.sistema.base.models.Venta;
import com.unl.sistema.base.models.Marca;
import com.unl.sistema.base.controller.dao.dao_models.DaoAuto;
import com.unl.sistema.base.controller.dao.dao_models.DaoMarca;
import com.unl.sistema.base.controller.Util.Utiles;

public class DaoVenta extends AdapterDao<Venta> {
    private Venta obj;
    private DaoAuto daoAuto = new DaoAuto();
    private DaoMarca daoMarca = new DaoMarca();

    public DaoVenta() {
        super(Venta.class);
    }

    public Venta getObj() {
        if (obj == null)
            this.obj = new Venta();
        return this.obj;
    }

    public void setObj(Venta obj) {
        this.obj = obj;
    }

    public Venta findById(Integer id) {
        for (Venta venta : this.listAll().toArray()) {
            if (venta.getId() != null && venta.getId().equals(id)) {
                return venta;
            }
        }
        return null;
    }

    public Boolean save() {
        try {
            obj.setId(listAll().getLength() + 1);
            this.persist(obj);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println(e);
            return false;
        }
    }

    public Boolean update(Integer pos) {
        try {
            this.update(obj, pos);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public LinkedList<HashMap<String, String>> all() {
        LinkedList<HashMap<String, String>> lista = new LinkedList<>();
        if (!this.listAll().isEmpty()) {
            Venta[] arreglo = this.listAll().toArray();
            for (int i = 0; i < arreglo.length; i++) {
                lista.add(toDict(arreglo[i]));
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Venta venta) {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", venta.getId() != null ? venta.getId().toString() : "");
        aux.put("precioFinal", venta.getPrecioFinal() != null ? venta.getPrecioFinal().toString() : "");
        aux.put("fecha", venta.getFecha() != null ? DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss").format(
                venta.getFecha().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()) : "");
        aux.put("idAuto", venta.getIdAuto() != null ? venta.getIdAuto().toString() : "");
        aux.put("idComprador", venta.getIdComprador() != null ? venta.getIdComprador().toString() : "");

        // --- Agrega la marca y modelo del auto ---
        if (venta.getIdAuto() != null) {
            Auto auto = null;
            for (Auto a : daoAuto.listAll().toArray()) {
                if (a.getId() != null && a.getId().equals(venta.getIdAuto())) {
                    auto = a;
                    break;
                }
            }
            if (auto != null) {
                // Obtener el nombre de la marca usando DaoMarca
                String nombreMarca = "";
                if (auto.getIdMarca() != null) {
                    Marca marca = daoMarca.findById(auto.getIdMarca());
                    if (marca != null && marca.getNombre() != null) {
                        nombreMarca = marca.getNombre();
                    }
                }
                aux.put("marca", nombreMarca);
                aux.put("modelo", auto.getModelo() != null ? auto.getModelo() : "");
            } else {
                aux.put("marca", "");
                aux.put("modelo", "");
            }
<<<<<<< HEAD
        }
        return lista;
    }

    public static <E extends Comparable<E>> void quickSortASC(E vec[], int inicio, int fin) {
        if (inicio >= fin)
            return;
        E pivote = vec[inicio];
        int elemIzq = inicio + 1;
        int elemDer = fin;
        while (elemIzq <= elemDer) {
            while (elemIzq <= fin && vec[elemIzq].compareTo(pivote) < 0) {
                elemIzq++;
            }
            while (elemDer > inicio && vec[elemDer].compareTo(pivote) >= 0) {
                elemDer--;
            }
            if (elemIzq < elemDer) {
                E temp = vec[elemIzq];
                vec[elemIzq] = vec[elemDer];
                vec[elemDer] = temp;
            }
        }
        if (elemDer > inicio) {
            E temp = vec[inicio];
            vec[inicio] = vec[elemDer];
            vec[elemDer] = temp;
        }
        quickSortASC(vec, inicio, elemDer - 1);
        quickSortASC(vec, elemDer + 1, fin);
    }

    public static <E extends Comparable<E>> void quickSortDES(E vec[], int inicio, int fin) {
        if (inicio >= fin)
            return;
        E pivote = vec[inicio];
        int elemIzq = inicio + 1;
        int elemDer = fin;
        while (elemIzq <= elemDer) {
            while (elemIzq <= fin && vec[elemIzq].compareTo(pivote) > 0) {
                elemIzq++;
            }
            while (elemDer > inicio && vec[elemDer].compareTo(pivote) <= 0) {
                elemDer--;
            }
            if (elemIzq < elemDer) {
                E temp = vec[elemIzq];
                vec[elemIzq] = vec[elemDer];
                vec[elemDer] = temp;
            }
        }
        if (elemDer > inicio) {
            E temp = vec[inicio];
            vec[inicio] = vec[elemDer];
            vec[elemDer] = temp;
        }
        quickSortDES(vec, inicio, elemDer - 1);
        quickSortDES(vec, elemDer + 1, fin);
=======
        } else {
            aux.put("marca", "");
            aux.put("modelo", "");
        }
   

        return aux;
    }
    
    public LinkedList<HashMap<String, String>> buscarPorAtributo(String atributo, String texto) throws Exception {
        LinkedList<HashMap<String, String>> lista = all(); // all() ya usa toDict y agrega marca/modelo
        // Puedes usar Utiles.INICIO, Utiles.FIN o 0 para búsqueda general (contains)
        return Utiles.busquedaLineal(lista, atributo, texto, 0);
>>>>>>> origin/feature/Sebas-ModuloValoracion
    }
}
