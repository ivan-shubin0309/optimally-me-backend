export class ItemDatasetGetDto {
    constructor(obj: any) {
        this.id = obj.id;
        this.company_id = obj.company_id;
        this.name = obj.name;
    }

    readonly id: string;
    readonly company_id: string;
    readonly name: string;
}