import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function buscarPorAtributo_1(atributo: string | undefined, valor: string | undefined, init?: EndpointRequestInit_1): Promise<Record<string, string | undefined> | undefined> { return client_1.call("MarcaService", "buscarPorAtributo", { atributo, valor }, init); }
async function create_1(nombre: string | undefined, estaActiva: boolean, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("MarcaService", "create", { nombre, estaActiva }, init); }
async function listMarca_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("MarcaService", "listMarca", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("MarcaService", "ordenar", { atributo, type }, init); }
async function update_1(id: number | undefined, nombre: string | undefined, estaActiva: boolean, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("MarcaService", "update", { id, nombre, estaActiva }, init); }
export { buscarPorAtributo_1 as buscarPorAtributo, create_1 as create, listMarca_1 as listMarca, ordenar_1 as ordenar, update_1 as update };
