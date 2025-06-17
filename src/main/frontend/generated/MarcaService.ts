import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import type Marca_1 from "./com/unl/sistema/base/models/Marca.js";
import client_1 from "./connect-client.default.js";
async function create_1(nombre: string | undefined, estaActiva: boolean, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("MarcaService", "create", { nombre, estaActiva }, init); }
async function listMarca_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("MarcaService", "listMarca", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Marca_1 | undefined> | undefined> { return client_1.call("MarcaService", "ordenar", { atributo, type }, init); }
export { create_1 as create, listMarca_1 as listMarca, ordenar_1 as ordenar };
