import type Usuario_1 from "./Usuario.js";
interface Conversacion {
    id?: number;
    idEmisor?: number;
    idReceptor?: number;
    idAuto?: number;
    fechaInicio?: string;
    estaActiva: boolean;
    usuario2?: Usuario_1;
    usuario1?: Usuario_1;
}
export default Conversacion;
