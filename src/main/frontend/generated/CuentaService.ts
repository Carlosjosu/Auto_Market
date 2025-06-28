import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
<<<<<<< HEAD
<<<<<<< HEAD
import client_1 from "./connect-client.default.js";
async function buscar_1(attribute: string | undefined, text: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("CuentaService", "buscar", { attribute, text, type }, init); }
async function create_1(correo: string | undefined, clave: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("CuentaService", "create", { correo, clave }, init); }
async function listCuenta_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("CuentaService", "listCuenta", {}, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("CuentaService", "ordenar", { atributo, type }, init); }
async function update_1(id: number | undefined, clave: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("CuentaService", "update", { id, clave }, init); }
export { buscar_1 as buscar, create_1 as create, listCuenta_1 as listCuenta, ordenar_1 as ordenar, update_1 as update };
=======
=======
>>>>>>> origin/feature/Sebas-ModuloValoracion
import type UserInfo_1 from "./com/unl/sistema/base/controller/services/CuentaService/UserInfo.js";
import client_1 from "./connect-client.default.js";
import type Authentication_1 from "./org/springframework/security/core/Authentication.js";
async function buscar_1(attribute: string | undefined, text: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("CuentaService", "buscar", { attribute, text, type }, init); }
async function create_1(correo: string | undefined, clave: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("CuentaService", "create", { correo, clave }, init); }
async function createRoles_1(init?: EndpointRequestInit_1): Promise<Record<string, string | undefined> | undefined> { return client_1.call("CuentaService", "createRoles", {}, init); }
async function createUsuarios_1(init?: EndpointRequestInit_1): Promise<Record<string, string | undefined> | undefined> { return client_1.call("CuentaService", "createUsuarios", {}, init); }
async function getAuthentication_1(init?: EndpointRequestInit_1): Promise<Authentication_1 | undefined> { return client_1.call("CuentaService", "getAuthentication", {}, init); }
async function getUserInfo_1(init?: EndpointRequestInit_1): Promise<UserInfo_1> { return client_1.call("CuentaService", "getUserInfo", {}, init); }
async function isLogin_1(init?: EndpointRequestInit_1): Promise<boolean | undefined> { return client_1.call("CuentaService", "isLogin", {}, init); }
async function listCuenta_1(init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("CuentaService", "listCuenta", {}, init); }
async function login_1(email: string | undefined, password: string | undefined, init?: EndpointRequestInit_1): Promise<Record<string, unknown> | undefined> { return client_1.call("CuentaService", "login", { email, password }, init); }
async function logout_1(init?: EndpointRequestInit_1): Promise<Record<string, string | undefined> | undefined> { return client_1.call("CuentaService", "logout", {}, init); }
async function main_1(args: Array<string | undefined> | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("CuentaService", "main", { args }, init); }
async function ordenar_1(atributo: string | undefined, type: number | undefined, init?: EndpointRequestInit_1): Promise<Array<Record<string, unknown> | undefined> | undefined> { return client_1.call("CuentaService", "ordenar", { atributo, type }, init); }
async function update_1(id: number | undefined, clave: string | undefined, init?: EndpointRequestInit_1): Promise<void> { return client_1.call("CuentaService", "update", { id, clave }, init); }
async function view_rol_1(init?: EndpointRequestInit_1): Promise<Record<string, string | undefined> | undefined> { return client_1.call("CuentaService", "view_rol", {}, init); }
export { buscar_1 as buscar, create_1 as create, createRoles_1 as createRoles, createUsuarios_1 as createUsuarios, getAuthentication_1 as getAuthentication, getUserInfo_1 as getUserInfo, isLogin_1 as isLogin, listCuenta_1 as listCuenta, login_1 as login, logout_1 as logout, main_1 as main, ordenar_1 as ordenar, update_1 as update, view_rol_1 as view_rol };
<<<<<<< HEAD
>>>>>>> origin/feature/Sebas-ModuloValoracion
=======
>>>>>>> origin/feature/Sebas-ModuloValoracion
