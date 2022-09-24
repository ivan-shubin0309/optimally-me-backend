import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { AlternativeName, ICreateAlternativeName } from '../../../../biomarkers/src/models';

@Injectable()
export class AlternativeNamesService {
  constructor(
    @Inject('ALTERNATIVE_NAME_MODEL') private readonly alternativeNameModel: Repository<AlternativeName>
  ) {}


  createBiomarkerAlternativeName(body: ICreateAlternativeName):  Promise<AlternativeName> {
    return this.alternativeNameModel.create({ ...body });
  }
}