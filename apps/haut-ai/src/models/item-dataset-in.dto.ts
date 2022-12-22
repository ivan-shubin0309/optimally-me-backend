export class ItemDatasetInDto {
    constructor(obj: any) {
        this.name = obj.name;
        this.image_type_id = obj.image_type_id;
    }

    readonly name: string;
    readonly image_type_id: string;
}