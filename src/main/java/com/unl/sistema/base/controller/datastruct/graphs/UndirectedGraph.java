package com.unl.sistema.base.controller.datastruct.graphs;


public class UndirectedGraph extends DirectedGraph {

    public UndirectedGraph(Integer nro_vertex) {
        super(nro_vertex);
        
    }

    @Override
    public void insert (Integer o, Integer d, Float weigth){
        if (o.intValue() <= nro_vertex().intValue() && d.intValue() <= nro_vertex().intValue()) {
            if (exists_edge(o, d) == null) {
                setNro_edge(nro_edge() + 1);;
                //origin
                Adjacency aux = new Adjacency();
                aux.setWeight(weigth);;
                aux.setDestiny(d);;
                getList_adyacencias()[o].add(aux);
                //destyni 
                Adjacency auxD = new Adjacency();
                auxD.setWeight(weigth);
                auxD.setDestiny(d);;
                getList_adyacencias()[d].add(auxD);
            }
        } else {
            throw new ArrayIndexOutOfBoundsException("Vetex origin o destiny index out");
        }
    }
    
}