import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    constructor(data: any) {
        this.id = data.id;
        this.username = data.username;
        this.role = data.role;
        this.email = data.email;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly id: string;

    @ApiProperty({ type: () => String, required: false })
    readonly username: string;

    @ApiProperty({ type: () => String, required: true })
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    readonly role: string;

    @ApiProperty({ type: () => String, required: true })
    readonly createdAt: string;

    @ApiProperty({ type: () => String, required: true })
    readonly updatedAt: string;
}