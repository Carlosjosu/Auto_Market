import { _getPropertyModel as _getPropertyModel_1, ArrayModel as ArrayModel_1, BooleanModel as BooleanModel_1, makeObjectEmptyValueCreator as makeObjectEmptyValueCreator_1, ObjectModel as ObjectModel_1 } from "@vaadin/hilla-lit-form";
import type Authentication_1 from "./Authentication.js";
import GrantedAuthorityModel_1 from "./GrantedAuthorityModel.js";
class AuthenticationModel<T extends Authentication_1 = Authentication_1> extends ObjectModel_1<T> {
    static override createEmptyValue = makeObjectEmptyValueCreator_1(AuthenticationModel);
    get credentials(): ObjectModel_1 {
        return this[_getPropertyModel_1]("credentials", (parent, key) => new ObjectModel_1(parent, key, false, { meta: { javaType: "java.lang.Object" } }));
    }
    get principal(): ObjectModel_1 {
        return this[_getPropertyModel_1]("principal", (parent, key) => new ObjectModel_1(parent, key, false, { meta: { javaType: "java.lang.Object" } }));
    }
    get authorities(): ArrayModel_1<GrantedAuthorityModel_1> {
        return this[_getPropertyModel_1]("authorities", (parent, key) => new ArrayModel_1(parent, key, true, (parent, key) => new GrantedAuthorityModel_1(parent, key, true), { meta: { javaType: "java.util.Collection" } }));
    }
    get authenticated(): BooleanModel_1 {
        return this[_getPropertyModel_1]("authenticated", (parent, key) => new BooleanModel_1(parent, key, false, { meta: { javaType: "boolean" } }));
    }
    get details(): ObjectModel_1 {
        return this[_getPropertyModel_1]("details", (parent, key) => new ObjectModel_1(parent, key, false, { meta: { javaType: "java.lang.Object" } }));
    }
}
export default AuthenticationModel;
