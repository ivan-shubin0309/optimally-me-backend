import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

export class UserDto {
    constructor(data: User) {
        this.id = data.id;
        this.role = data.role;
        this.email = data.email;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly id: string;

    @ApiProperty({ type: () => String, required: true })
    readonly email: string;

    @ApiProperty({ type: () => String, required: true })
    readonly role: number;

    @ApiProperty({ type: () => String, required: true })
    readonly firstName: string;

    @ApiProperty({ type: () => String, required: true })
    readonly lastName: string;

    @ApiProperty({ type: () => String, required: true })
    readonly createdAt: string;

    @ApiProperty({ type: () => String, required: true })
    readonly updatedAt: string;
}