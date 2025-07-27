interface Mensaje {
    id?: number;
    contenido?: string;
    fechaEnvio?: string;
    idRemitente?: number;
    idConversacion?: number;
    leido: boolean;
}
export default Mensaje;
