import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function create_1(marca: string | undefined, anio: number, precio: number, kilometraje: number, color: string | undefined, matricula: string | undefined, categoria: string | undefined, tipoCombustible: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("AutoService", "create", { marca, anio, precio, kilometraje, color, matricula, categoria, tipoCombustible }, init); }
async function listAuto_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("AutoService", "listAuto", {}, init); }
async function listCategoria_1(init?: EndpointRequestInit_1): Promise<Array<string | undefined> | undefined> { return client_1.call("AutoService", "listCategoria", {}, init); }
async function listTipoCombustible_1(init?: EndpointRequestInit_1): Promise<Array<string | undefined> | undefined> { return client_1.call("AutoService", "listTipoCombustible", {}, init); }
export { create_1 as create, listAuto_1 as listAuto, listCategoria_1 as listCategoria, listTipoCombustible_1 as listTipoCombustible };
