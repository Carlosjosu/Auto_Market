import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function create_1(nombre: string | undefined, correo: string | undefined, contrasenia: string | undefined, telefono: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("UsuarioService", "create", { nombre, correo, contrasenia, telefono }, init); }
async function listUsuario_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("UsuarioService", "listUsuario", {}, init); }
export { create_1 as create, listUsuario_1 as listUsuario };
