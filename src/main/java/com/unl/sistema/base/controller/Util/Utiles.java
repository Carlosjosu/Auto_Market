package com.unl.sistema.base.controller.Util;

import java.util.HashMap;

import com.unl.sistema.base.controller.datastruct.list.LinkedList;

public class Utiles {
    public static final int ASCENDENTE = 1;
    public static final int DESCENDENTE = 2;
    public static final int INICIO = 1;
    public static final int FIN = 2;

    public static <E extends Comparable<E>> void quickSort(E vec[], int inicio, int fin, int type) {
        if (inicio >= fin)
            return;
        E pivote = vec[inicio];
        int elemIzq = inicio + 1;
        int elemDer = fin;
        while (elemIzq <= elemDer) {
            if (type == ASCENDENTE) {
                while (elemIzq <= fin && vec[elemIzq].compareTo(pivote) < 0) {
                    elemIzq++;
                }
                while (elemDer > inicio && vec[elemDer].compareTo(pivote) >= 0) {
                    elemDer--;
                }
            } else {
                while (elemIzq <= fin && vec[elemIzq].compareTo(pivote) > 0) {
                    elemIzq++;
                }
                while (elemDer > inicio && vec[elemDer].compareTo(pivote) <= 0) {
                    elemDer--;
                }
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
        quickSort(vec, inicio, elemDer - 1, type);
        quickSort(vec, elemDer + 1, fin, type);
    }

    public static void quickSortHashMap(HashMap<String, String> vec[], int inicio, int fin, String atributo, int type) {
        if (inicio >= fin)
            return;
        HashMap<String, String> pivote = vec[inicio];
        int elemIzq = inicio + 1;
        int elemDer = fin;
        while (elemIzq <= elemDer) {
            if (type == ASCENDENTE) {
                while (elemIzq <= fin
                        && vec[elemIzq].get(atributo).toString().compareTo(pivote.get(atributo).toString()) < 0) {
                    elemIzq++;
                }
                while (elemDer > inicio
                        && vec[elemDer].get(atributo).toString().compareTo(pivote.get(atributo).toString()) >= 0) {
                    elemDer--;
                }
            } else {
                while (elemIzq <= fin
                        && vec[elemIzq].get(atributo).toString().compareTo(pivote.get(atributo).toString()) > 0) {
                    elemIzq++;
                }
                while (elemDer > inicio
                        && vec[elemDer].get(atributo).toString().compareTo(pivote.get(atributo).toString()) <= 0) {
                    elemDer--;
                }
            }
            if (elemIzq < elemDer) {
                HashMap<String, String> temp = vec[elemIzq];
                vec[elemIzq] = vec[elemDer];
                vec[elemDer] = temp;
            }
        }
        if (elemDer > inicio) {
            HashMap<String, String> temp = vec[inicio];
            vec[inicio] = vec[elemDer];
            vec[elemDer] = temp;
        }
        quickSortHashMap(vec, inicio, elemDer - 1, atributo, type);
        quickSortHashMap(vec, elemDer + 1, fin, atributo, type);
    }

    public static void quickSortObject(HashMap<String, Object> vec[], int inicio, int fin, String atributo, int type) {
        if (inicio >= fin)
            return;
        HashMap<String, Object> pivote = vec[inicio];
        int elemIzq = inicio + 1;
        int elemDer = fin;
        while (elemIzq <= elemDer) {
            if (type == ASCENDENTE) {
                while (elemIzq <= fin
                        && vec[elemIzq].get(atributo).toString().compareTo(pivote.get(atributo).toString()) < 0) {
                    elemIzq++;
                }
                while (elemDer > inicio
                        && vec[elemDer].get(atributo).toString().compareTo(pivote.get(atributo).toString()) >= 0) {
                    elemDer--;
                }
            } else {
                while (elemIzq <= fin
                        && vec[elemIzq].get(atributo).toString().compareTo(pivote.get(atributo).toString()) > 0) {
                    elemIzq++;
                }
                while (elemDer > inicio
                        && vec[elemDer].get(atributo).toString().compareTo(pivote.get(atributo).toString()) <= 0) {
                    elemDer--;
                }
            }
            if (elemIzq < elemDer) {
                HashMap<String, Object> temp = vec[elemIzq];
                vec[elemIzq] = vec[elemDer];
                vec[elemDer] = temp;
            }
        }
        if (elemDer > inicio) {
            HashMap<String, Object> temp = vec[inicio];
            vec[inicio] = vec[elemDer];
            vec[elemDer] = temp;
        }
        quickSortObject(vec, inicio, elemDer - 1, atributo, type);
        quickSortObject(vec, elemDer + 1, fin, atributo, type);
    }

    public static LinkedList<HashMap<String, String>> busquedaLineal(LinkedList<HashMap<String, String>> lista,
            String atributo, String texto, Integer type) throws Exception {
        LinkedList<HashMap<String, String>> resp = new LinkedList<>();
        if (!lista.isEmpty()) {
            HashMap<String, String> arr[] = lista.toArray();
            switch (type) {
                case Utiles.INICIO:
                    for (int i = 0; i < arr.length; i++) {
                        if (arr[i].get(atributo).toString().toLowerCase().startsWith(texto.toLowerCase())) {
                            resp.add(arr[i]);
                        }
                    }
                    break;
                case Utiles.FIN:
                    for (int i = 0; i < arr.length; i++) {
                        if (arr[i].get(atributo).toString().toLowerCase().endsWith(texto.toLowerCase())) {
                            resp.add(arr[i]);
                        }
                    }
                    break;
                default:
                    for (int i = 0; i < arr.length; i++) {
                        if (arr[i].get(atributo).toString().toLowerCase().contains(texto.toLowerCase())) {
                            resp.add(arr[i]);
                        }
                    }
                    break;
            }
        }
        return resp;
    }
<<<<<<< HEAD
=======

    public static void knuthShuffle(HashMap<String, String>[] array) {
        java.util.Random rnd = new java.util.Random();
        for (int i = array.length - 1; i > 0; i--) {
            int j = rnd.nextInt(i + 1);
            HashMap<String, String> temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
>>>>>>> origin/develop
}