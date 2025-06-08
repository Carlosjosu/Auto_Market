import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function create_1(url: string | undefined, descripcion: string | undefined, idAuto: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("ImagenService", "create", { url, descripcion, idAuto }, init); }
async function listImagen_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("ImagenService", "listImagen", {}, init); }
async function listaAuto_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("ImagenService", "listaAuto", {}, init); }
export { create_1 as create, listaAuto_1 as listaAuto, listImagen_1 as listImagen };
