import { _getPropertyModel as _getPropertyModel_1, BooleanModel as BooleanModel_1, makeObjectEmptyValueCreator as makeObjectEmptyValueCreator_1, NumberModel as NumberModel_1, ObjectModel as ObjectModel_1, StringModel as StringModel_1 } from "@vaadin/hilla-lit-form";
import type Mensaje_1 from "./Mensaje.js";
class MensajeModel<T extends Mensaje_1 = Mensaje_1> extends ObjectModel_1<T> {
    static override createEmptyValue = makeObjectEmptyValueCreator_1(MensajeModel);
    get id(): NumberModel_1 {
        return this[_getPropertyModel_1]("id", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get contenido(): StringModel_1 {
        return this[_getPropertyModel_1]("contenido", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
    get fechaEnvio(): StringModel_1 {
        return this[_getPropertyModel_1]("fechaEnvio", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.util.Date" } }));
    }
    get idRemitente(): NumberModel_1 {
        return this[_getPropertyModel_1]("idRemitente", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get idConversacion(): NumberModel_1 {
        return this[_getPropertyModel_1]("idConversacion", (parent, key) => new NumberModel_1(parent, key, true, { meta: { javaType: "java.lang.Integer" } }));
    }
    get leido(): BooleanModel_1 {
        return this[_getPropertyModel_1]("leido", (parent, key) => new BooleanModel_1(parent, key, false, { meta: { javaType: "boolean" } }));
    }
}
export default MensajeModel;
