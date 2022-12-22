import { ApiProperty } from '@nestjs/swagger';

class AuxImageUrlDto {
    constructor(propertyName: string, value: string) {
        this.propertyName = propertyName;
        this.value = value;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly propertyName: string;

    @ApiProperty({ type: () => String, required: true })
    readonly value: string;
}

class AuxImageTypeDto {
    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.techName = data.tech_name;
    }

    @ApiProperty({ type: () => String, required: true })
    readonly id: string;

    @ApiProperty({ type: () => String, required: true })
    readonly name: string;

    @ApiProperty({ type: () => String, required: true })
    readonly techName: string;
}

export class ItemImageAuxOutDto {
    constructor(data: any) {
        this.id = data.id;
        this.auxImageType = data.aux_image_type && new AuxImageTypeDto(data.aux_image_type);
        this.creationTime = data.creation_time;
        this.applicationId = data.application_id;
        this.applicationName = data.application_name;
        this.applicationRunId = data.application_run_id;
        this.applicationDescription = data.application_description;
        this.urls = Object
            .entries(data.urls)
            .map((entry: [string, string]) => new AuxImageUrlDto(...entry));
    }

    @ApiProperty({ type: () => String, required: true })
    readonly id: string;

    @ApiProperty({ type: () => AuxImageTypeDto, required: false })
    readonly auxImageType?: AuxImageTypeDto;

    @ApiProperty({ type: () => String, required: true })
    readonly creationTime: string;

    @ApiProperty({ type: () => String, required: true })
    readonly applicationId: string;

    @ApiProperty({ type: () => String, required: true })
    readonly applicationName: string;

    @ApiProperty({ type: () => String, required: false })
    readonly applicationRunId: string;

    @ApiProperty({ type: () => String, required: true })
    readonly applicationDescription: string;

    @ApiProperty({ type: () => [AuxImageUrlDto], required: true })
    readonly urls: AuxImageUrlDto[];
}