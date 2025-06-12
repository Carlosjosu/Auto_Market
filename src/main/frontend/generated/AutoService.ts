import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
<<<<<<< HEAD
<<<<<<< HEAD
=======
async function create_1(marca: string | undefined, anio: number, precio: number, kilometraje: number, color: string | undefined, matricula: string | undefined, categoria: string | undefined, tipoCombustible: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("AutoService", "create", { marca, anio, precio, kilometraje, color, matricula, categoria, tipoCombustible }, init); }
async function listAuto_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("AutoService", "listAuto", {}, init); }
async function listCategoria_1(init?: EndpointRequestInit_1): Promise<Array<string | undefined> | undefined> { return client_1.call("AutoService", "listCategoria", {}, init); }
async function listTipoCombustible_1(init?: EndpointRequestInit_1): Promise<Array<string | undefined> | undefined> { return client_1.call("AutoService", "listTipoCombustible", {}, init); }
export { create_1 as create, listAuto_1 as listAuto, listCategoria_1 as listCategoria, listTipoCombustible_1 as listTipoCombustible };
=======
>>>>>>> origin/develop
async function create_1(modelo: string | undefined, anio: string | undefined, puertas: number | undefined, color: string | undefined, kilometraje: string | undefined, ciudad: string | undefined, precio: string | undefined, matricula: string | undefined, codigoVIN: string | undefined, descripcion: string | undefined, fechaRegistro: string | undefined, estaDisponible: boolean | undefined, idVenta: number | undefined, idMarca: number | undefined, tipoCombustible: string | undefined, categoria: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("AutoService", "create", { modelo, anio, puertas, color, kilometraje, ciudad, precio, matricula, codigoVIN, descripcion, fechaRegistro, estaDisponible, idVenta, idMarca, tipoCombustible, categoria }, init); }
async function getCategorias_1(init?: EndpointRequestInit_1): Promise<Array<string | undefined> | undefined> { return client_1.call("AutoService", "getCategorias", {}, init); }
async function getTiposCombustible_1(init?: EndpointRequestInit_1): Promise<Array<string | undefined> | undefined> { return client_1.call("AutoService", "getTiposCombustible", {}, init); }
async function listAuto_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("AutoService", "listAuto", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("AutoService", "ordenar", { atributo, type }, init); }
export { create_1 as create, getCategorias_1 as getCategorias, getTiposCombustible_1 as getTiposCombustible, listAuto_1 as listAuto, ordenar_1 as ordenar };
<<<<<<< HEAD
=======
async function create_1(marca: string | undefined, anio: number, precio: number, kilometraje: number, color: string | undefined, matricula: string | undefined, categoria: string | undefined, tipoCombustible: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("AutoService", "create", { marca, anio, precio, kilometraje, color, matricula, categoria, tipoCombustible }, init); }
async function listAuto_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("AutoService", "listAuto", {}, init); }
async function listCategoria_1(init?: EndpointRequestInit_1): Promise<Array<string | undefined> | undefined> { return client_1.call("AutoService", "listCategoria", {}, init); }
async function listTipoCombustible_1(init?: EndpointRequestInit_1): Promise<Array<string | undefined> | undefined> { return client_1.call("AutoService", "listTipoCombustible", {}, init); }
export { create_1 as create, listAuto_1 as listAuto, listCategoria_1 as listCategoria, listTipoCombustible_1 as listTipoCombustible };
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======
>>>>>>> Carlos-ModuloAuto
>>>>>>> origin/develop
