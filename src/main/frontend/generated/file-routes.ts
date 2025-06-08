import { createRoute as createRoute_1 } from "@vaadin/hilla-file-router/runtime.js";
import type { AgnosticRoute as AgnosticRoute_1 } from "@vaadin/hilla-file-router/types.js";
import * as Page_1 from "../views/@index.js";
import * as Layout_1 from "../views/@layout.js";
import * as Page_2 from "../views/auto-list.js";
import * as Page_3 from "../views/favorito-list.js";
import * as Page_4 from "../views/imagen-list.js";
import * as Page_5 from "../views/publicacion-list.js";
import * as Page_6 from "../views/task-list.js";
import * as Page_7 from "../views/usuario-list.js";
import * as Page_8 from "../views/venta-list.js";
const routes: readonly AgnosticRoute_1[] = [
    createRoute_1("", Layout_1, [
        createRoute_1("", Page_1),
        createRoute_1("auto-list", Page_2),
        createRoute_1("favorito-list", Page_3),
        createRoute_1("imagen-list", Page_4),
        createRoute_1("publicacion-list", Page_5),
        createRoute_1("task-list", Page_6),
        createRoute_1("usuario-list", Page_7),
        createRoute_1("venta-list", Page_8)
    ])
];
export default routes;
