import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import type Venta_1 from "./com/unl/sistema/base/models/Venta.js";
import client_1 from "./connect-client.default.js";
async function create_1(precioFinal: number | undefined, fecha: string | undefined, idAuto: number | undefined, idComprador: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("VentaService", "create", { precioFinal, fecha, idAuto, idComprador }, init); }
async function listVenta_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("VentaService", "listVenta", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Venta_1 | undefined> | undefined> { return client_1.call("VentaService", "ordenar", { atributo, type }, init); }
export { create_1 as create, listVenta_1 as listVenta, ordenar_1 as ordenar };
