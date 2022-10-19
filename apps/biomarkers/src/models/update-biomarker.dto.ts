import { CreateBiomarkerDto } from './create-biomarker.dto';

export class UpdateBiomarkerDto {
    constructor(body: CreateBiomarkerDto) {
        this.name = body.name;
        this.categoryId = body.categoryId;
        this.unitId = body.unitId;
        this.templateId = body.ruleId || null;
    }

    name: string;
    categoryId: number;
    unitId: number;
    templateId: number;
}