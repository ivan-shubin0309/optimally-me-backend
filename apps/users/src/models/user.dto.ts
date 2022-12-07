import { ApiProperty } from '@nestjs/swagger';
import { UserAdditionalFieldDto } from './user-additional-field.dto';
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
        this.additionalField = data.additionalField
            ? new UserAdditionalFieldDto(data.additionalField)
            : undefined;
    }

    @ApiProperty({ type: () => Number, required: true })
    readonly id: number;

    @ApiProperty({ type: () => String, required: true })
    readonly email: string;

    @ApiProperty({ type: () => Number, required: true })
    readonly role: number;

    @ApiProperty({ type: () => String, required: true })
    readonly firstName: string;

    @ApiProperty({ type: () => String, required: true })
    readonly lastName: string;

    @ApiProperty({ type: () => UserAdditionalFieldDto, required: false })
    readonly additionalField: UserAdditionalFieldDto;

    @ApiProperty({ type: () => String, required: true })
    readonly createdAt: string;

    @ApiProperty({ type: () => String, required: true })
    readonly updatedAt: string;
}