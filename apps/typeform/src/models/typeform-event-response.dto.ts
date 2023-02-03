import { ApiProperty } from '@nestjs/swagger';

export class TypeformEventResponseDto {
    constructor(errorCode: string, message: string) {
        this.errorCode = errorCode;
        this.message = message;
    }

    @ApiProperty({ type: () => String, required: false })
    readonly errorCode: string;

    @ApiProperty({ type: () => String, required: false })
    readonly message: string;
}