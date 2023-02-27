export interface ICreateBiomarker {
    readonly name: string;
    readonly label: string;
    readonly shortName: string;
    readonly alternativeNames?: string[];
    readonly ruleName: string;
    readonly ruleId: number;
    readonly categoryId: number;
    readonly unitId?: number;
    readonly filters: ICreateFilter[];
    readonly hautAiMetricType?: number;
}

export interface ICreateFilter {
    readonly name?: string;
    readonly summary: string;
    readonly resultSummary: ICreateResultSummary;
    readonly whatIsIt: string;
    readonly whatAreTheCauses: ICreateWhatAreTheCauses;
    readonly whatAreTheRisks?: ICreateWhatAreTheRisks;
    readonly whatCanYouDo?: string;
    readonly criticalLow: number;
    readonly lowMin: number;
    readonly lowMax: number;
    readonly subOptimalMin: number;
    readonly subOptimalMax: number;
    readonly optimalMin?: number;
    readonly optimalMax?: number;
    readonly supraOptimalMin: number;
    readonly supraOptimalMax: number;
    readonly highMin: number;
    readonly highMax: number;
    readonly criticalHigh: number;
    readonly recommendations: IAddRecommendation[];
    readonly interactions?: ICreateInteraction[];
    readonly ages?: number[];
    readonly sexes?: number[];
    readonly ethnicities?: number[];
    readonly otherFeatures?: number[];
    readonly groups?: ICreateFilterGroup[];
}

export interface ICreateResultSummary {
    readonly criticalLow: string;
    readonly low: string;
    readonly subOptimal: string;
    readonly optimal: string;
    readonly supraOptimal: string;
    readonly high: string;
    readonly criticalHigh: string;
}

export interface ICreateWhatAreTheCauses {
    readonly low: string;
    readonly high: string;
    readonly bulletList: ICreateFilterBulletList[];
}

export interface ICreateFilterBulletList {
    readonly type: number;
    readonly content: string;
    readonly studyLinks: string[];
}

export interface ICreateWhatAreTheRisks {
    readonly low: string;
    readonly high: string;
    readonly bulletList: ICreateFilterBulletList[];
}

export interface IAddRecommendation {
    readonly order: number;
    readonly recommendationId: number;
    readonly type: number;
}

export interface ICreateInteraction {
    readonly type: number;
    readonly name: string;
    readonly alsoKnowAs: string;
    readonly impact: number;
    readonly effects: string;
}

export interface ICreateFilterGroup {
    readonly type: number;
    readonly recommendationTypes: number[];
}

export interface IUpdateFilter extends ICreateFilter {
    readonly id?: number;
}