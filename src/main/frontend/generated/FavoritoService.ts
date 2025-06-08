import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function create_1(fechaMarcado: string | undefined, idUsuario: number | undefined, idPublicacion: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("FavoritoService", "create", { fechaMarcado, idUsuario, idPublicacion }, init); }
async function listFavorito_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("FavoritoService", "listFavorito", {}, init); }
async function listaPublicacion_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("FavoritoService", "listaPublicacion", {}, init); }
async function listaUsuario_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("FavoritoService", "listaUsuario", {}, init); }
export { create_1 as create, listaPublicacion_1 as listaPublicacion, listaUsuario_1 as listaUsuario, listFavorito_1 as listFavorito };
