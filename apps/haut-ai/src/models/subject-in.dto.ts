export class SubjectInDto {
    constructor(obj: any) {
        this.name = obj.name;
        this.birth_date = obj.birth_date;
        this.biological_sex = obj.biological_sex;
        this.meta = obj.meta;
    }

    readonly name: string;
    readonly birth_date?: string;
    readonly biological_sex?: string;
    readonly meta?: any;
}