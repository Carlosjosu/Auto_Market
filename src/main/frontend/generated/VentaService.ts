import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function create_1(precioVenta: number, fechaVenta: string | undefined, idComprador: number | undefined, idPublicacion: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("VentaService", "create", { precioVenta, fechaVenta, idComprador, idPublicacion }, init); }
async function listVenta_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("VentaService", "listVenta", {}, init); }
async function listaComprador_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("VentaService", "listaComprador", {}, init); }
async function listaPublicacion_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("VentaService", "listaPublicacion", {}, init); }
export { create_1 as create, listaComprador_1 as listaComprador, listaPublicacion_1 as listaPublicacion, listVenta_1 as listVenta };
