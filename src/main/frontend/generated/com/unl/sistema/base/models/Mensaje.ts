import type Conversacion_1 from "./Conversacion.js";
import type Usuario_1 from "./Usuario.js";
interface Mensaje {
    id?: number;
    contenido?: string;
    fechaEnvio?: string;
    idRemitente?: number;
    idConversacion?: number;
    remitente?: Usuario_1;
    conversacion?: Conversacion_1;
}
export default Mensaje;
