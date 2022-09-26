import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BiomarkerFilter, LibraryFilter, ICreateFilter } from '../../../../biomarkers/src/models';

@Injectable()
export class FiltersService {
  constructor(
    @Inject('BIOMARKER_FILTER_MODEL') private readonly biomarkerFilterModel: Repository<BiomarkerFilter>,
    @Inject('LIBRARY_FILTER_MODEL') private readonly libraryFilterModel: Repository<LibraryFilter>
  ) {}


  createBiomarkerFilter(body: ICreateFilter):  Promise<BiomarkerFilter> {
    return this.biomarkerFilterModel.create({ ...body });
  }

  createLibraryFilter(body: ICreateFilter):  Promise<LibraryFilter> {
    return this.libraryFilterModel.create({ ...body });
  }
}