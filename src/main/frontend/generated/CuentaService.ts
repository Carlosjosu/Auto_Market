import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function buscar_1(attribute: string | undefined, text: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("CuentaService", "buscar", { attribute, text, type }, init); }
async function create_1(correo: string | undefined, clave: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("CuentaService", "create", { correo, clave }, init); }
async function listCuenta_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("CuentaService", "listCuenta", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("CuentaService", "ordenar", { atributo, type }, init); }
async function update_1(id: number | undefined, clave: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("CuentaService", "update", { id, clave }, init); }
export { buscar_1 as buscar, create_1 as create, listCuenta_1 as listCuenta, ordenar_1 as ordenar, update_1 as update };
