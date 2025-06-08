import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import type DaoConversacion_1 from "./com/unl/sistema/base/controller/dao/dao_models/DaoConversacion.js";
import type Conversacion_1 from "./com/unl/sistema/base/models/Conversacion.js";
import type Mensaje_1 from "./com/unl/sistema/base/models/Mensaje.js";
import client_1 from "./connect-client.default.js";
async function crearConversacion_1(usuario1Id: number | undefined, usuario2Id: number | undefined, init?: EndpointRequestInit_1): Promise<Conversacion_1 | undefined> { return client_1.call("ChatService", "crearConversacion", { usuario1Id, usuario2Id }, init); }
async function enviarMensaje_1(conversacionId: number | undefined, remitenteId: number | undefined, contenido: string | undefined, init?: EndpointRequestInit_1): Promise<Mensaje_1 | undefined> { return client_1.call("ChatService", "enviarMensaje", { conversacionId, remitenteId, contenido }, init); }
async function getConversacionDao_1(init?: EndpointRequestInit_1): Promise<DaoConversacion_1 | undefined> { return client_1.call("ChatService", "getConversacionDao", {}, init); }
async function obtenerConversacionesUsuario_1(usuarioId: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Conversacion_1 | undefined> | undefined> { return client_1.call("ChatService", "obtenerConversacionesUsuario", { usuarioId }, init); }
async function obtenerMensajesConversacion_1(conversacionId: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Mensaje_1 | undefined> | undefined> { return client_1.call("ChatService", "obtenerMensajesConversacion", { conversacionId }, init); }
export { crearConversacion_1 as crearConversacion, enviarMensaje_1 as enviarMensaje, getConversacionDao_1 as getConversacionDao, obtenerConversacionesUsuario_1 as obtenerConversacionesUsuario, obtenerMensajesConversacion_1 as obtenerMensajesConversacion };
