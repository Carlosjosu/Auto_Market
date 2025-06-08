import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import type Favorito_1 from "./com/unl/sistema/base/models/Favorito.js";
import client_1 from "./connect-client.default.js";
async function create_1(fechaGuardado: string | undefined, idAuto: number | undefined, idUsuario: number | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("FavoritoService", "create", { fechaGuardado, idAuto, idUsuario }, init); }
async function listFavorito_1(init?: EndpointRequestInit_1): Promise<Array<Favorito_1 | undefined> | undefined> { return client_1.call("FavoritoService", "listFavorito", {}, init); }
export { create_1 as create, listFavorito_1 as listFavorito };
