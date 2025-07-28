package com.unl.sistema.base.controller.datastruct.graphs;

import com.unl.sistema.base.controller.datastruct.list.LinkedList;

public abstract class Graph {
    public abstract Integer nro_vertex();
    public abstract Integer nro_edge();
    public abstract Adjacency exists_edge(Integer o, Integer d);
    public abstract Float weight_edge(Integer o, Integer d);
    public abstract void insert(Integer o, Integer d);
    public abstract void insert(Integer o, Integer d, Float weight);
    public abstract LinkedList<Adjacency> adjacencies(Integer o);

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= nro_vertex(); i++) {
            sb.append("Vetex =").append(String.valueOf(i)).append("\n");
            LinkedList<Adjacency> list = adjacencies(i);
            if (!list.isEmpty()) {
                Adjacency[] matrix = list.toArray();
                for (Adjacency ad : matrix) {
                    sb.append("\tAdyacency =").append("\n").append("\tVertex").append(String.valueOf(ad.getDestiny()));
                    if (!ad.getWeight().isNaN()) {
                        sb.append("Weigth =" + ad.getWeight().toString()).append("\n");
                    }

                }
            }

        }

        return sb.toString();
    }
}
