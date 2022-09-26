import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BiomarkerFilterSex, LibraryFilterSex, ICreateFilterSex } from '../../../../biomarkers/src/models';

@Injectable()
export class FilterSexesService {
  constructor(
    @Inject('BIOMARKER_FILTER_SEX_MODEL') private readonly biomarkerFilterSexModel: Repository<BiomarkerFilterSex>,
    @Inject('LIBRARY_FILTER_SEX_MODEL') private readonly libraryFilterSexModel: Repository<LibraryFilterSex>
  ) {}


  createBiomarkerFilterSex(body: ICreateFilterSex):  Promise<BiomarkerFilterSex> {
    return this.biomarkerFilterSexModel.create({ ...body });
  }

  createLibraryFilterSex(body: ICreateFilterSex):  Promise<LibraryFilterSex> {
    return this.libraryFilterSexModel.create({ ...body });
  }
}