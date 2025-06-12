import { _getPropertyModel as _getPropertyModel_1, BooleanModel as BooleanModel_1, makeObjectEmptyValueCreator as makeObjectEmptyValueCreator_1, NumberModel as NumberModel_1, ObjectModel as ObjectModel_1, StringModel as StringModel_1 } from "@vaadin/hilla-lit-form";
import type Auto_1 from "./Auto.js";
import CategoriaEnumModel_1 from "./CategoriaEnumModel.js";
import TipoCombustibleEnumModel_1 from "./TipoCombustibleEnumModel.js";
class AutoModel<T extends Auto_1 = Auto_1> extends ObjectModel_1<T> {
    static override createEmptyValue = makeObjectEmptyValueCreator_1(AutoModel);
    get id(): NumberModel_1 {
        return this[_getPropertyModel_1]("id", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get anio(): StringModel_1 {
        return this[_getPropertyModel_1]("anio", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
    get modelo(): StringModel_1 {
        return this[_getPropertyModel_1]("modelo", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
    get puertas(): NumberModel_1 {
        return this[_getPropertyModel_1]("puertas", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get color(): StringModel_1 {
        return this[_getPropertyModel_1]("color", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
    get kilometraje(): NumberModel_1 {
        return this[_getPropertyModel_1]("kilometraje", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Float" } }));
    }
    get ciudad(): StringModel_1 {
        return this[_getPropertyModel_1]("ciudad", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
    get precio(): NumberModel_1 {
        return this[_getPropertyModel_1]("precio", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Float" } }));
    }
    get matricula(): StringModel_1 {
        return this[_getPropertyModel_1]("matricula", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
    get codigoVIN(): StringModel_1 {
        return this[_getPropertyModel_1]("codigoVIN", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
    get descripcion(): StringModel_1 {
        return this[_getPropertyModel_1]("descripcion", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
    get fechaRegistro(): StringModel_1 {
        return this[_getPropertyModel_1]("fechaRegistro", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.util.Date" } }));
    }
    get estaDisponible(): BooleanModel_1 {
        return this[_getPropertyModel_1]("estaDisponible", (parent, key) => new BooleanModel_1(parent, key, false, { meta: { javaType: "boolean" } }));
    }
    get idVendedor(): NumberModel_1 {
        return this[_getPropertyModel_1]("idVendedor", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get idMarca(): NumberModel_1 {
        return this[_getPropertyModel_1]("idMarca", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get tipoCombustible(): TipoCombustibleEnumModel_1 {
        return this[_getPropertyModel_1]("tipoCombustible", (parent, key) => new TipoCombustibleEnumModel_1(parent, key, true));
    }
    get categoria(): CategoriaEnumModel_1 {
        return this[_getPropertyModel_1]("categoria", (parent, key) => new CategoriaEnumModel_1(parent, key, true));
    }
}
export default AutoModel;
