import { ApiProperty } from '@nestjs/swagger';
import { UserWidgetDataSourceDto } from './user-widget-data-source.dto';
import { UserWidgetDataSource } from './user-widget-data-source.entity';

export class UserWidgetDataSourcesDto {
    constructor(userSources: UserWidgetDataSource[]) {
        this.data = userSources.map(userSource => new UserWidgetDataSourceDto(userSource));
    }

    @ApiProperty({ type: () => [UserWidgetDataSourceDto], required: false })
    readonly data: UserWidgetDataSourceDto[];
}
