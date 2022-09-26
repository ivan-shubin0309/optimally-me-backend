import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BiomarkerFilterOtherFeature, LibraryFilterOtherFeature, ICreateFilterOtherFeature } from '../../../../biomarkers/src/models';

@Injectable()
export class FilterOtherFeaturesService {
  constructor(
    @Inject('BIOMARKER_FILTER_OTHER_FEATURE_MODEL') private readonly biomarkerFilterOtherFeatureModel: Repository<BiomarkerFilterOtherFeature>,
    @Inject('LIBRARY_FILTER_OTHER_FEATURE_MODEL') private readonly libraryFilterOtherFeatureModel: Repository<LibraryFilterOtherFeature>
  ) {}


  createBiomarkerFilterOtherFeature(body: ICreateFilterOtherFeature):  Promise<BiomarkerFilterOtherFeature> {
    return this.biomarkerFilterOtherFeatureModel.create({ ...body });
  }

  createLibraryFilterOtherFeature(body: ICreateFilterOtherFeature):  Promise<LibraryFilterOtherFeature> {
    return this.libraryFilterOtherFeatureModel.create({ ...body });
  }
}