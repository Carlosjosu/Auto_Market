package com.unl.sistema.base.controller.dao.dao_models;

import com.unl.sistema.base.controller.Util.Utiles;
import com.unl.sistema.base.controller.dao.AdapterDao;
import com.unl.sistema.base.controller.datastruct.list.LinkedList;
import com.unl.sistema.base.models.Auto;
import com.unl.sistema.base.models.CategoriaEnum;
import com.unl.sistema.base.models.Marca;
import com.unl.sistema.base.models.TipoCombustibleEnum;
import java.util.HashMap;
import com.unl.sistema.base.controller.dao.dao_models.DaoMarca;

public class DaoAuto extends AdapterDao<Auto> {
    private Auto obj;

    public DaoAuto() {
        super(Auto.class);
    }

    public Auto getObj() {
        if (obj == null)
            this.obj = new Auto();
        return this.obj;
    }

    public void setObj(Auto obj) {
        this.obj = obj;
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
            Auto[] autos = this.listAll().toArray();
            for (Auto auto : autos) {
                lista.add(toDict(auto)); // <-- Esto es lo importante
            }
        }
        return lista;
    }

    public HashMap<String, String> toDict(Auto auto) {
        HashMap<String, String> aux = new HashMap<>();
        aux.put("id", String.valueOf(auto.getId()));
        aux.put("anio", String.valueOf(auto.getAnio()));
        aux.put("modelo", String.valueOf(auto.getModelo()));
        aux.put("puertas", String.valueOf(auto.getPuertas()));
        aux.put("color", String.valueOf(auto.getColor()));
        aux.put("kilometraje", String.valueOf(auto.getKilometraje()));
        aux.put("ciudad", String.valueOf(auto.getCiudad()));
        aux.put("precio", String.valueOf(auto.getPrecio()));
        aux.put("matricula", String.valueOf(auto.getMatricula()));
        aux.put("codigoVIN", String.valueOf(auto.getCodigoVIN()));
        aux.put("descripcion", String.valueOf(auto.getDescripcion()));
        aux.put("fechaRegistro", String.valueOf(auto.getFechaRegistro()));
        aux.put("estaDisponible", String.valueOf(auto.isEstaDisponible()));
        aux.put("idMarca", String.valueOf(auto.getIdMarca()));
        try {
            DaoMarca daoMarca = new DaoMarca();
            String nombreMarca = "";
            if (auto.getIdMarca() != null) {
                Marca marca = null;
                LinkedList<Marca> marcas = daoMarca.listAll();
                Marca[] marcasArray = marcas.toArray();
                for (Marca m : marcasArray) {
                    if (m.getId().equals(auto.getIdMarca())) {
                        marca = m;
                        break;
                    }
                }
                if (marca != null) {
                    nombreMarca = marca.getNombre();
                }
            }
            aux.put("marca", nombreMarca);
        } catch (Exception e) {
            aux.put("marca", "");
        }
        aux.put("tipoCombustible", String.valueOf(auto.getTipoCombustible()));
        aux.put("categoria", auto.getCategoria() != null ? auto.getCategoria().name() : null);
        System.out.println("toDict: " + aux);
        return aux;
    }

    public LinkedList<Auto> ordenarString(String atributo, Integer type) {
        LinkedList<Auto> lista = new LinkedList<>();
        if (!listAll().isEmpty()) {
            Auto arreglo[] = listAll().toArray();
            int n = arreglo.length;
            String[] valores = new String[n];
            for (int i = 0; i < n; i++) {
                try {
                    String getter = "get" + atributo.substring(0, 1).toUpperCase() + atributo.substring(1);
                    valores[i] = String.valueOf(Auto.class.getMethod(getter).invoke(arreglo[i]));
                } catch (Exception e) {
                    valores[i] = "";
                }
            }
            if (type == Utiles.ASCENDENTE) {
                quickSortASC(valores, 0, n - 1);
            } else {
                quickSortDES(valores, 0, n - 1);
            }
            for (String valor : valores) {
                for (int i = 0; i < n; i++) {
                    try {
                        String getter = "get" + atributo.substring(0, 1).toUpperCase() + atributo.substring(1);
                        String val = String.valueOf(Auto.class.getMethod(getter).invoke(arreglo[i]));
                        if (arreglo[i] != null && val.equals(valor)) {
                            lista.add(arreglo[i]);
                        }
                    } catch (Exception e) {
                        // Ignorar
                    }
                }
            }
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
    }

    public static void main(String[] args) {
        DaoAuto da = new DaoAuto();

        // Primer auto
        da.getObj().setId(da.listAll().getLength() + 1);
        try {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");


            // Cuarto auto
            da.getObj().setId(da.listAll().getLength() + 1);
            da.getObj().setAnio("2015");
            da.getObj().setModelo("Spark GT");
            da.getObj().setPuertas(5);
            da.getObj().setColor("Azul");
            da.getObj().setKilometraje(60000f);
            da.getObj().setCiudad("Ambato");
            da.getObj().setPrecio(9000f);
            da.getObj().setMatricula("GHI789");
            da.getObj().setCodigoVIN("4HGCM82633A004355");
            da.getObj().setDescripcion("Económico y compacto, ideal para ciudad");
            da.getObj().setFechaRegistro(sdf.parse("2022-08-20"));
            da.getObj().setEstaDisponible(true);
            da.getObj().setIdMarca(4);
            da.getObj().setTipoCombustible(TipoCombustibleEnum.ECOPAIS);
            da.getObj().setCategoria(CategoriaEnum.HATCHBACK);
            if (da.save())
            System.out.println("GUARDADO: " + da.getObj());
            else
            System.out.println("Hubo un error");
            da.setObj(null);

            // Quinto auto
            da.getObj().setId(da.listAll().getLength() + 1);
            da.getObj().setAnio("2021");
            da.getObj().setModelo("CX-5");
            da.getObj().setPuertas(5);
            da.getObj().setColor("Gris");
            da.getObj().setKilometraje(20000f);
            da.getObj().setCiudad("Loja");
            da.getObj().setPrecio(28000f);
            da.getObj().setMatricula("JKL012");
            da.getObj().setCodigoVIN("5HGCM82633A004356");
            da.getObj().setDescripcion("SUV familiar, poco uso");
            da.getObj().setFechaRegistro(sdf.parse("2024-01-05"));
            da.getObj().setEstaDisponible(true);
            da.getObj().setIdMarca(5);
            da.getObj().setTipoCombustible(TipoCombustibleEnum.SUPER);
            da.getObj().setCategoria(CategoriaEnum.SUV);
            if (da.save())
            System.out.println("GUARDADO: " + da.getObj());
            else
            System.out.println("Hubo un error");
            da.setObj(null);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}