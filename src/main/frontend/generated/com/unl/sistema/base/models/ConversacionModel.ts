import { _getPropertyModel as _getPropertyModel_1, BooleanModel as BooleanModel_1, makeObjectEmptyValueCreator as makeObjectEmptyValueCreator_1, NumberModel as NumberModel_1, ObjectModel as ObjectModel_1, StringModel as StringModel_1 } from "@vaadin/hilla-lit-form";
import type Conversacion_1 from "./Conversacion.js";
import UsuarioModel_1 from "./UsuarioModel.js";
class ConversacionModel<T extends Conversacion_1 = Conversacion_1> extends ObjectModel_1<T> {
    static override createEmptyValue = makeObjectEmptyValueCreator_1(ConversacionModel);
    get id(): NumberModel_1 {
        return this[_getPropertyModel_1]("id", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get idEmisor(): NumberModel_1 {
        return this[_getPropertyModel_1]("idEmisor", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get idReceptor(): NumberModel_1 {
        return this[_getPropertyModel_1]("idReceptor", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get idAuto(): NumberModel_1 {
        return this[_getPropertyModel_1]("idAuto", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get fechaInicio(): StringModel_1 {
        return this[_getPropertyModel_1]("fechaInicio", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.util.Date" } }));
    }
    get estaActiva(): BooleanModel_1 {
        return this[_getPropertyModel_1]("estaActiva", (parent, key) => new BooleanModel_1(parent, key, false, { meta: { javaType: "boolean" } }));
    }
    get usuario1(): UsuarioModel_1 {
        return this[_getPropertyModel_1]("usuario1", (parent, key) => new UsuarioModel_1(parent, key, true));
    }
    get usuario2(): UsuarioModel_1 {
        return this[_getPropertyModel_1]("usuario2", (parent, key) => new UsuarioModel_1(parent, key, true));
    }
}
export default ConversacionModel;
