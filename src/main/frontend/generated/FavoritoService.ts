import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
<<<<<<< HEAD
<<<<<<< HEAD
import type Favorito_1 from "./com/unl/sistema/base/models/Favorito.js";
import client_1 from "./connect-client.default.js";
async function create_1(fechaGuardado: string | undefined, idAuto: number | undefined, idUsuario: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("FavoritoService", "create", { fechaGuardado, idAuto, idUsuario }, init); }
async function listFavorito_1(init?: EndpointRequestInit_1): Promise<Array<Favorito_1 | undefined> | undefined> { return client_1.call("FavoritoService", "listFavorito", {}, init); }
export { create_1 as create, listFavorito_1 as listFavorito };
=======
import client_1 from "./connect-client.default.js";
async function create_1(fechaMarcado: string | undefined, idUsuario: number | undefined, idPublicacion: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("FavoritoService", "create", { fechaMarcado, idUsuario, idPublicacion }, init); }
async function listFavorito_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("FavoritoService", "listFavorito", {}, init); }
async function listaPublicacion_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("FavoritoService", "listaPublicacion", {}, init); }
async function listaUsuario_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("FavoritoService", "listaUsuario", {}, init); }
export { create_1 as create, listaPublicacion_1 as listaPublicacion, listaUsuario_1 as listaUsuario, listFavorito_1 as listFavorito };
>>>>>>> 4388000 (Carga de modulo valoración con método de ordenación)
=======
import type Favorito_1 from "./com/unl/sistema/base/models/Favorito.js";
import client_1 from "./connect-client.default.js";
async function create_1(fechaGuardado: string | undefined, idAuto: number | undefined, idUsuario: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("FavoritoService", "create", { fechaGuardado, idAuto, idUsuario }, init); }
async function listFavorito_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("FavoritoService", "listFavorito", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Favorito_1 | undefined> | undefined> { return client_1.call("FavoritoService", "ordenar", { atributo, type }, init); }
export { create_1 as create, listFavorito_1 as listFavorito, ordenar_1 as ordenar };
>>>>>>> a6689ee (Corrección métodos de ordenación Quicksort)
