export class CustomerMetafieldDto {
    constructor(key: string, value: any, type: 'list.single_line_text_field' | 'date' | 'boolean', namespace: string) {
        this.key = key;
        this.value = value;
        this.type = type;
        this.namespace = namespace;
    }

    readonly key: string;
    readonly value: string;
    readonly type: string;
    readonly namespace: string;
}