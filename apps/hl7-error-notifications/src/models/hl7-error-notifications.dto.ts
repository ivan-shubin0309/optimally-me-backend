import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/src/models/pagination.dto';
import { Hl7ErrorNotificationDto } from './hl7-error-notification.dto';
import { Hl7ErrorNotification } from './hl7-error-notification.entity';

export class Hl7ErrorNotificationsDto {
    @ApiProperty({ type: () => [Hl7ErrorNotificationDto] })
    readonly data: Hl7ErrorNotificationDto[];

    @ApiProperty({ type: () => PaginationDto, required: true })
    readonly pagination: PaginationDto;

    constructor(hl7ErrorNotifications: Hl7ErrorNotification[], pagination: PaginationDto) {
        this.pagination = pagination;
        this.data = hl7ErrorNotifications.map(hl7ErrorNotification => new Hl7ErrorNotificationDto(hl7ErrorNotification));
    }
}
