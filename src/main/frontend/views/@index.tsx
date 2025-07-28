// TODO Replace with your own main view.


import { Navigate } from 'react-router-dom';
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";

export const config: ViewConfig = {
    menu: {
        exclude: true
    },
};

// Redirigir automáticamente a /autos
export default function MainView() {
    return <Navigate to="/Auto" replace />;
}