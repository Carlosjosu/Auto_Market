interface Conversacion {
    id?: number;
    idEmisor?: number;
    idReceptor?: number;
    idAuto?: number;
    fechaInicio?: string;
    estaActiva: boolean;
}
export default Conversacion;
