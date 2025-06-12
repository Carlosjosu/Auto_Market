import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function create_1(fechaPublicacion: string | undefined, titulo: string | undefined, descripcion: string | undefined, estado: string | undefined, idAuto: number | undefined, idVendedor: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("PublicacionService", "create", { fechaPublicacion, titulo, descripcion, estado, idAuto, idVendedor }, init); }
async function listEstado_1(init?: EndpointRequestInit_1): Promise<Array<string | undefined> | undefined> { return client_1.call("PublicacionService", "listEstado", {}, init); }
async function listPublicacion_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("PublicacionService", "listPublicacion", {}, init); }
async function listaAuto_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("PublicacionService", "listaAuto", {}, init); }
async function listaVendedor_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("PublicacionService", "listaVendedor", {}, init); }
export { create_1 as create, listaAuto_1 as listaAuto, listaVendedor_1 as listaVendedor, listEstado_1 as listEstado, listPublicacion_1 as listPublicacion };
