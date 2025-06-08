import { _getPropertyModel as _getPropertyModel_1, makeObjectEmptyValueCreator as makeObjectEmptyValueCreator_1 } from "@vaadin/hilla-lit-form";
import ConversacionModel_1 from "../../../models/ConversacionModel.js";
import AdapterDaoModel_1 from "../AdapterDaoModel.js";
import type DaoConversacion_1 from "./DaoConversacion.js";
class DaoConversacionModel<T extends DaoConversacion_1 = DaoConversacion_1> extends AdapterDaoModel_1<T> {
    static override createEmptyValue = makeObjectEmptyValueCreator_1(DaoConversacionModel);
    get obj(): ConversacionModel_1 {
        return this[_getPropertyModel_1]("obj", (parent, key) => new ConversacionModel_1(parent, key, true));
    }
}
export default DaoConversacionModel;
