import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function buscar_1(atributo: string | undefined, valor: string | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("VentaService", "buscar", { atributo, valor }, init); }
async function create_1(precioFinal: number | undefined, fecha: string | undefined, idAuto: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("VentaService", "create", { precioFinal, fecha, idAuto }, init); }
async function listVenta_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("VentaService", "listVenta", {}, init); }
async function ordenar_1(atributo: string | undefined, tipo: number, init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("VentaService", "ordenar", { atributo, tipo }, init); }
async function update_1(id: number | undefined, precioFinal: number | undefined, fecha: string | undefined, idAuto: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("VentaService", "update", { id, precioFinal, fecha, idAuto }, init); }
export { buscar_1 as buscar, create_1 as create, listVenta_1 as listVenta, ordenar_1 as ordenar, update_1 as update };
