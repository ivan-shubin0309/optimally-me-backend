import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'sequelize-typescript';
import { BiomarkerInteraction, LibraryInteraction, ICreateInteraction } from '../../../../biomarkers/src/models';

@Injectable()
export class InteractionsService {
  constructor(
    @Inject('BIOMARKER_INTERACTION_MODEL') private readonly biomarkerInteractionModel: Repository<BiomarkerInteraction>,
    @Inject('LIBRARY_INTERACTION_MODEL') private readonly libraryInteractionModel: Repository<LibraryInteraction>
  ) {}


  createBiomarkerInteraction(body: ICreateInteraction):  Promise<BiomarkerInteraction> {
    return this.biomarkerInteractionModel.create({ ...body });
  }

  createLibraryInteraction(body: ICreateInteraction):  Promise<LibraryInteraction> {
    return this.libraryInteractionModel.create({ ...body });
  }
}