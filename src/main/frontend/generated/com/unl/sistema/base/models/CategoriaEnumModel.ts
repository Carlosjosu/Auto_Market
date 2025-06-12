import { _enum as _enum_1, EnumModel as EnumModel_1, makeEnumEmptyValueCreator as makeEnumEmptyValueCreator_1 } from "@vaadin/hilla-lit-form";
import CategoriaEnum_1 from "./CategoriaEnum.js";
class CategoriaEnumModel extends EnumModel_1<typeof CategoriaEnum_1> {
    static override createEmptyValue = makeEnumEmptyValueCreator_1(CategoriaEnumModel);
    readonly [_enum_1] = CategoriaEnum_1;
}
export default CategoriaEnumModel;
