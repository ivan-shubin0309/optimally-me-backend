import { ApiProperty } from '@nestjs/swagger';
import { IsOnlyDate } from '../../../common/src/resources/common/is-only-date.decorator';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class PostSampleStatusDto {
    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly sample_id: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly product_sku: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly product_name: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly lab_name: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly lab_profile_id: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly order_source: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly order_id: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly customer_username: string;

    @ApiProperty({ type: () => Boolean, required: false })
    @IsOptional()
    @IsBoolean()
    readonly require_female_cycle_status: boolean;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly fulfilment_name: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly fulfilment_id: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly fulfilment_sku: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    @IsOnlyDate()
    readonly expiry_date: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly lot_no: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly return_tracking_id: string;

    @ApiProperty({ type: () => String, required: false })
    @IsOptional()
    @IsString()
    readonly outbound_tracking_id: string;
}