import { _getPropertyModel as _getPropertyModel_1, ArrayModel as ArrayModel_1, makeObjectEmptyValueCreator as makeObjectEmptyValueCreator_1, ObjectModel as ObjectModel_1, StringModel as StringModel_1 } from "@vaadin/hilla-lit-form";
import type UserInfo_1 from "./UserInfo.js";
class UserInfoModel<T extends UserInfo_1 = UserInfo_1> extends ObjectModel_1<T> {
    static override createEmptyValue = makeObjectEmptyValueCreator_1(UserInfoModel);
    get name(): StringModel_1 {
        return this[_getPropertyModel_1]("name", (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }));
    }
    get authorities(): ArrayModel_1<StringModel_1> {
        return this[_getPropertyModel_1]("authorities", (parent, key) => new ArrayModel_1(parent, key, true, (parent, key) => new StringModel_1(parent, key, true, { meta: { javaType: "java.lang.String" } }), { meta: { javaType: "java.util.Collection" } }));
    }
}
export default UserInfoModel;
