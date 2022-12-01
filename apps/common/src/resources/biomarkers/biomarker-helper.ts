import { CreateBiomarkerDto } from '../../../../biomarkers/src/models/create-biomarker.dto';
import { SexTypes } from '../filters/sex-types';
import { BiomarkerSexTypes } from './biomarker-sex-types';

export class BiomarkerHelper {
    static getBiomarkerSex(body: CreateBiomarkerDto): BiomarkerSexTypes {
        let sex = BiomarkerSexTypes.all;

        if (body.filters && body.filters.length) {
            let isMale = false, isFemale = false;
            for (let i = 0; i < body.filters.length; i++) {
                body.filters[i].sexes.forEach(sexType => {
                    if (!isMale && sexType === SexTypes.male) {
                        isMale = true;
                    }
                    if (!isFemale && sexType === SexTypes.female) {
                        isFemale = true;
                    }
                });
                if (isMale && isFemale) {
                    break;
                }
            }
            if (isMale && isFemale) {
                sex = BiomarkerSexTypes.all;
            } else if (isMale) {
                sex = BiomarkerSexTypes.male;
            } else if (isFemale) {
                sex = BiomarkerSexTypes.female;
            }
        }

        return sex;
    }
}