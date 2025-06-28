import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import type Favorito_1 from "./com/unl/sistema/base/models/Favorito.js";
import client_1 from "./connect-client.default.js";
<<<<<<< HEAD
<<<<<<< HEAD
async function create_1(fechaGuardado: string | undefined, idAuto: number | undefined, idUsuario: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("FavoritoService", "create", { fechaGuardado, idAuto, idUsuario }, init); }
async function listFavorito_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("FavoritoService", "listFavorito", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Favorito_1 | undefined> | undefined> { return client_1.call("FavoritoService", "ordenar", { atributo, type }, init); }
export { create_1 as create, listFavorito_1 as listFavorito, ordenar_1 as ordenar };
=======
=======
>>>>>>> origin/feature/Sebas-ModuloValoracion
async function buscar_1(atributo: string | undefined, valor: string | undefined, init?: EndpointRequestInit_1): Promise<Array<Favorito_1 | undefined> | undefined> { return client_1.call("FavoritoService", "buscar", { atributo, valor }, init); }
async function create_1(fechaGuardado: string | undefined, idAuto: number | undefined, idUsuario: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("FavoritoService", "create", { fechaGuardado, idAuto, idUsuario }, init); }
async function delete_1(favorito: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("FavoritoService", "delete", { favorito }, init); }
async function listFavorito_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, string | undefined> | undefined> | undefined> { return client_1.call("FavoritoService", "listFavorito", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Favorito_1 | undefined> | undefined> { return client_1.call("FavoritoService", "ordenar", { atributo, type }, init); }
export { buscar_1 as buscar, create_1 as create, delete_1 as delete, listFavorito_1 as listFavorito, ordenar_1 as ordenar };
<<<<<<< HEAD
>>>>>>> origin/feature/Sebas-ModuloValoracion
=======
>>>>>>> origin/feature/Sebas-ModuloValoracion
