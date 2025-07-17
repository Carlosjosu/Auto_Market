import { createRoute as createRoute_1 } from "@vaadin/hilla-file-router/runtime.js";
import type { AgnosticRoute as AgnosticRoute_1 } from "@vaadin/hilla-file-router/types.js";
import * as Page_1 from "../views/@index.js";
import * as Layout_1 from "../views/@layout.js";
import * as Page_2 from "../views/Auto.js";
import * as Page_3 from "../views/cuenta-list.js";
import * as Page_4 from "../views/favorito-list.js";
import * as Page_5 from "../views/Imagen.js";
import * as Page_6 from "../views/login.js";
import * as Page_7 from "../views/Marca.js";
import * as Page_8 from "../views/MensajeView.js";
import * as Page_9 from "../views/usuario-list.js";
import * as Page_10 from "../views/valoracion-list.js";
import * as Page_11 from "../views/venta-list.js";
const routes: readonly AgnosticRoute_1[] = [
    createRoute_1("", Layout_1, [
        createRoute_1("", Page_1),
        createRoute_1("Auto", Page_2),
        createRoute_1("cuenta-list", Page_3),
        createRoute_1("favorito-list", Page_4),
        createRoute_1("Imagen", Page_5),
        createRoute_1("login", Page_6),
        createRoute_1("Marca", Page_7),
        createRoute_1("MensajeView", Page_8),
        createRoute_1("usuario-list", Page_9),
        createRoute_1("valoracion-list", Page_10),
        createRoute_1("venta-list", Page_11)
    ])
];
export default routes;
