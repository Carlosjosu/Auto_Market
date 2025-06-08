package com.unl.sistema.base.controller.datastruct.queue;

import com.unl.sistema.base.controller.datastruct.list.LinkedList;

public class QueueImplementation<E> extends LinkedList<E> {
    private Integer top;

    public Integer getTop() {
        return this.top;
    }
    
    public QueueImplementation(Integer top){
        this.top = top;
    }

    protected boolean isFullQueue(){
        return this.top >= getLength();
    }

    protected void queue(E info) throws Exception{
        if (!isFullQueue()){
            add(info);
        } else{
            throw new ArrayIndexOutOfBoundsException("Queue full");
        }
    }

    protected E dequeue() throws Exception{
        return deleteFirst();
    }
    
}
