package com.unl.sistema.base.controller.datastruct.graphs;

import com.unl.sistema.base.controller.datastruct.list.LinkedList;

public class DirectedGraph extends Graph {
    private Integer nro_vertex;
    private Integer nro_edge;
    private LinkedList<Adjacency> list_adyacencias[];

    public DirectedGraph(Integer nro_vertex) {
        
        this.nro_vertex = nro_vertex;
        this.nro_edge = 0;
        list_adyacencias = new LinkedList[nro_vertex + 1];
        for (int i = 1; i <= nro_vertex; i++) {
            list_adyacencias[i] = new LinkedList<>();

        }
    }

    public void setNro_vertex(Integer nro_vertex) {
        this.nro_vertex = nro_vertex;
    }

    public void setNro_edge(Integer nro_edge) {
        this.nro_edge = nro_edge;
    }

    public LinkedList<Adjacency>[] getList_adyacencias() {
        return list_adyacencias;
    }

    public void setList_adyacencias(LinkedList<Adjacency>[] list_adyacencias) {
        this.list_adyacencias = list_adyacencias;
    }

    @Override
    public Integer nro_vertex() {
        // TODO Auto-generated method stub
        return this.nro_vertex;
    }

    @Override
    public Integer nro_edge() {
        // TODO Auto-generated method stub
        return this.nro_edge;
    }

    @Override
    public Adjacency exists_edge(Integer o, Integer d) {
        // TODO Auto-generated method stub
        Adjacency band = null;
        if (o.intValue() <= nro_vertex.intValue() && d.intValue() <= nro_vertex.intValue()) {
            LinkedList<Adjacency> list = list_adyacencias[o];
            if (!list.isEmpty()) {
                Adjacency[] matrix = list.toArray();
                for (Adjacency adj : matrix) {
                    if (adj.getDestiny().intValue() == d.intValue()) {
                        band = adj;
                        break;
                    }

                }
            }

        }
        return band;
    }

    @Override
    public Float weight_edge(Integer o, Integer d) {
        // TODO Auto-generated method stub
        Adjacency adj = exists_edge(o, d);
        if (adj != null) {
            return adj.getWeight();
        }
        return Float.NaN;
    }

    @Override
    public void insert(Integer o, Integer d) {
        // TODO Auto-generated method stub
        insert(o, d, Float.NaN);
    }

    @Override
    public void insert(Integer o, Integer d, Float weigth) {
        // TODO Auto-generated method stub
        if (o.intValue() <= nro_vertex.intValue() && d.intValue() <= nro_vertex.intValue()) {
            if (exists_edge(o, d) == null) {
                nro_edge++;
                Adjacency aux = new Adjacency();
                aux.setWeight(weigth);;
                aux.setDestiny(d);;
                list_adyacencias[o].add(aux);
            }
        } else {
            throw new ArrayIndexOutOfBoundsException("Vetex origin o destiny index out");
        }
    }

    @Override
    public LinkedList<Adjacency> adjacencies(Integer o) {
        // TODO Auto-generated method stub
        return list_adyacencias[o];
    }

}