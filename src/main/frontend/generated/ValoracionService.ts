import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import type Valoracion_1 from "./com/unl/sistema/base/models/Valoracion.js";
import client_1 from "./connect-client.default.js";
async function create_1(puntuacion: number | undefined, fecha: string | undefined, comentario: string | undefined, idVenta: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("ValoracionService", "create", { puntuacion, fecha, comentario, idVenta }, init); }
async function listValoracion_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("ValoracionService", "listValoracion", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Valoracion_1 | undefined> | undefined> { return client_1.call("ValoracionService", "ordenar", { atributo, type }, init); }
export { create_1 as create, listValoracion_1 as listValoracion, ordenar_1 as ordenar };
