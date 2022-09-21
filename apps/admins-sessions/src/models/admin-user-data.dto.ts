import { ApiProperty } from '@nestjs/swagger';

export class AdminUserDataDto {

    @ApiProperty({ type: () => String, required: true })
    readonly firstName: string;

    @ApiProperty({ type: () => String, required: true })
    readonly lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}