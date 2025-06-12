import type CategoriaEnum_1 from "./CategoriaEnum.js";
import type TipoCombustibleEnum_1 from "./TipoCombustibleEnum.js";
interface Auto {
    id?: number;
    anio?: string;
    modelo?: string;
    puertas?: number;
    color?: string;
    kilometraje?: number;
    ciudad?: string;
    precio?: number;
    matricula?: string;
    codigoVIN?: string;
    descripcion?: string;
    fechaRegistro?: string;
    estaDisponible: boolean;
    idVendedor?: number;
    idMarca?: number;
    tipoCombustible?: TipoCombustibleEnum_1;
    categoria?: CategoriaEnum_1;
}
export default Auto;
