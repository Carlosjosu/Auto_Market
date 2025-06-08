import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
<<<<<<< HEAD
<<<<<<< HEAD
import type Venta_1 from "./com/unl/sistema/base/models/Venta.js";
import client_1 from "./connect-client.default.js";
async function create_1(precioFinal: number | undefined, fecha: string | undefined, idAuto: number | undefined, idComprador: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("VentaService", "create", { precioFinal, fecha, idAuto, idComprador }, init); }
async function listVenta_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("VentaService", "listVenta", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Venta_1 | undefined> | undefined> { return client_1.call("VentaService", "ordenar", { atributo, type }, init); }
export { create_1 as create, listVenta_1 as listVenta, ordenar_1 as ordenar };
=======
import client_1 from "./connect-client.default.js";
async function create_1(precioVenta: number, fechaVenta: string | undefined, idComprador: number | undefined, idPublicacion: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("VentaService", "create", { precioVenta, fechaVenta, idComprador, idPublicacion }, init); }
async function listVenta_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("VentaService", "listVenta", {}, init); }
async function listaComprador_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("VentaService", "listaComprador", {}, init); }
async function listaPublicacion_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("VentaService", "listaPublicacion", {}, init); }
export { create_1 as create, listaComprador_1 as listaComprador, listaPublicacion_1 as listaPublicacion, listVenta_1 as listVenta };
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======
import type Venta_1 from "./com/unl/sistema/base/models/Venta.js";
import client_1 from "./connect-client.default.js";
async function create_1(precioFinal: number | undefined, fecha: string | undefined, idAuto: number | undefined, idComprador: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("VentaService", "create", { precioFinal, fecha, idAuto, idComprador }, init); }
async function listVenta_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("VentaService", "listVenta", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Venta_1 | undefined> | undefined> { return client_1.call("VentaService", "ordenar", { atributo, type }, init); }
export { create_1 as create, listVenta_1 as listVenta, ordenar_1 as ordenar };
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
