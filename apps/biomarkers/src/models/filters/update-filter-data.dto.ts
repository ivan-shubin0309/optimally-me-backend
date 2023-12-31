import { IUpdateFilter } from '../create-biomarker.interface';

export class UpdateFilterDataDto {
    constructor(body: IUpdateFilter, biomarkerId: number) {
        this.name = body.name;
        this.summary = body.summary;
        this.whatIsIt = body.whatIsIt;
        this.whatAreTheRisksLow = body.whatAreTheRisks?.low;
        this.whatAreTheRisksHigh = body.whatAreTheRisks?.high;
        this.whatAreTheCausesLow = body.whatAreTheCauses?.low;
        this.whatAreTheCausesHigh = body.whatAreTheCauses?.high;
        this.whatCanYouDo = body.whatCanYouDo;
        this.criticalLow = body.criticalLow;
        this.lowMin = body.lowMin;
        this.lowMax = body.lowMax;
        this.subOptimalMin = body.subOptimalMin;
        this.subOptimalMax = body.subOptimalMax;
        this.optimalMin = body.optimalMin;
        this.optimalMax = body.optimalMax;
        this.supraOptimalMin = body.supraOptimalMin;
        this.supraOptimalMax = body.supraOptimalMax;
        this.highMin = body.highMin;
        this.highMax = body.highMax;
        this.criticalHigh = body.criticalHigh;
        this.biomarkerId = biomarkerId;
    }

    readonly name: string = null;
    readonly summary: string = null;
    readonly whatIsIt: string = null;
    readonly whatAreTheRisksLow: string = null;
    readonly whatAreTheRisksHigh: string = null;
    readonly whatAreTheCausesLow: string = null;
    readonly whatAreTheCausesHigh: string = null;
    readonly whatCanYouDo: string = null;
    readonly criticalLow: number = null;
    readonly lowMin: number = null;
    readonly lowMax: number = null;
    readonly subOptimalMin: number = null;
    readonly subOptimalMax: number = null;
    readonly optimalMin: number = null;
    readonly optimalMax: number = null;
    readonly supraOptimalMin: number = null;
    readonly supraOptimalMax: number = null;
    readonly highMin: number = null;
    readonly highMax: number = null;
    readonly criticalHigh: number = null;
    readonly removedFromBiomarkerId: number = null;
    readonly biomarkerId: number = null;
}