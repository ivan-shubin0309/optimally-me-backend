import { BiomarkerSexTypes } from '../../../common/src/resources/biomarkers/biomarker-sex-types';
import { ICreateBiomarker } from './create-biomarker.interface';

export class UpdateBiomarkerDto {
    constructor(body: ICreateBiomarker) {
        this.name = body.name;
        this.categoryId = body.categoryId;
        this.unitId = body.unitId || null;
        this.templateId = body.ruleId || null;
        this.label = body.label;
        this.shortName = body.shortName;
    }

    name: string;
    categoryId: number;
    unitId: number;
    templateId: number;
    label: string;
    shortName: string;
    sex: BiomarkerSexTypes;
}