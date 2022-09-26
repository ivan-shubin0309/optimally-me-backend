import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BiomarkerFilterAge, LibraryFilterAge, ICreateFilterAge } from '../../../../biomarkers/src/models';

@Injectable()
export class FilterAgesService {
  constructor(
    @Inject('BIOMARKER_FILTER_AGE_MODEL') private readonly biomarkerFilterAgeModel: Repository<BiomarkerFilterAge>,
    @Inject('LIBRARY_FILTER_AGE_MODEL') private readonly libraryFilterAgeModel: Repository<LibraryFilterAge>
  ) {}


  createBiomarkerFilterAge(body: ICreateFilterAge):  Promise<BiomarkerFilterAge> {
    return this.biomarkerFilterAgeModel.create({ ...body });
  }

  createLibraryFilterAge(body: ICreateFilterAge):  Promise<LibraryFilterAge> {
    return this.libraryFilterAgeModel.create({ ...body });
  }
}