import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function create_1(url: string | undefined, descripcion: string | undefined, idAuto: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("ImagenService", "create", { url, descripcion, idAuto }, init); }
<<<<<<< HEAD
<<<<<<< HEAD
async function listImagen_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("ImagenService", "listImagen", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("ImagenService", "ordenar", { atributo, type }, init); }
export { create_1 as create, listImagen_1 as listImagen, ordenar_1 as ordenar };
=======
async function listImagen_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("ImagenService", "listImagen", {}, init); }
async function listaAuto_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("ImagenService", "listaAuto", {}, init); }
export { create_1 as create, listaAuto_1 as listaAuto, listImagen_1 as listImagen };
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======
async function listImagen_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("ImagenService", "listImagen", {}, init); }
async function listaAuto_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("ImagenService", "listaAuto", {}, init); }
export { create_1 as create, listaAuto_1 as listaAuto, listImagen_1 as listImagen };
=======
async function listImagen_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("ImagenService", "listImagen", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("ImagenService", "ordenar", { atributo, type }, init); }
export { create_1 as create, listImagen_1 as listImagen, ordenar_1 as ordenar };
>>>>>>> Carlos-ModuloAuto
>>>>>>> origin/develop
