import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BiomarkerFilterEthnicity, LibraryFilterEthnicity, ICreateFilterEthnicity } from '../../../../biomarkers/src/models';

@Injectable()
export class FilterEthnicityService {
  constructor(
    @Inject('BIOMARKER_FILTER_ETHNICITY_MODEL') private readonly biomarkerFilterEthnicityModel: Repository<BiomarkerFilterEthnicity>,
    @Inject('LIBRARY_FILTER_ETHNICITY_MODEL') private readonly libraryFilterEthnicityModel: Repository<LibraryFilterEthnicity>
  ) {}


  createBiomarkerFilterEthnicity(body: ICreateFilterEthnicity):  Promise<BiomarkerFilterEthnicity> {
    return this.biomarkerFilterEthnicityModel.create({ ...body });
  }

  createLibraryFilterEthnicity(body: ICreateFilterEthnicity):  Promise<LibraryFilterEthnicity> {
    return this.libraryFilterEthnicityModel.create({ ...body });
  }
}