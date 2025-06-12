import { _enum as _enum_1, EnumModel as EnumModel_1, makeEnumEmptyValueCreator as makeEnumEmptyValueCreator_1 } from "@vaadin/hilla-lit-form";
import TipoCombustibleEnum_1 from "./TipoCombustibleEnum.js";
class TipoCombustibleEnumModel extends EnumModel_1<typeof TipoCombustibleEnum_1> {
    static override createEmptyValue = makeEnumEmptyValueCreator_1(TipoCombustibleEnumModel);
    readonly [_enum_1] = TipoCombustibleEnum_1;
}
export default TipoCombustibleEnumModel;
