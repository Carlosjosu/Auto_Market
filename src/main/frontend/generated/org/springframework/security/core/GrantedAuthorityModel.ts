import { _getPropertyModel as _getPropertyModel_1, makeObjectEmptyValueCreator as makeObjectEmptyValueCreator_1, ObjectModel as ObjectModel_1, StringModel as StringModel_1 } from "@vaadin/hilla-lit-form";
import type GrantedAuthority_1 from "./GrantedAuthority.js";
class GrantedAuthorityModel<T extends GrantedAuthority_1 = GrantedAuthority_1> extends ObjectModel_1<T> {
    static override createEmptyValue = makeObjectEmptyValueCreator_1(GrantedAuthorityModel);
    get authority(): StringModel_1 {
        return this[_getPropertyModel_1]("authority", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
}
export default GrantedAuthorityModel;
