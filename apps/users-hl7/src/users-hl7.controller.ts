import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { UsersHl7ObjectsService } from './users-hl7-objects.service';
import { Hl7ObjectsDto } from '../../hl7/src/models/hl7-objects.dto';
import { PaginationHelper } from 'apps/common/src/utils/helpers/pagination.helper';
import { GetUserHl7ObjectListDto } from './models/get-user-hl7-object-list.dto';

@ApiBearerAuth()
@ApiTags('users/hl7-objects')
@Controller('users/hl7-objects')
export class UsersHl7Controller {
    constructor(
        private readonly usersHl7ObjectsService: UsersHl7ObjectsService,
    ) { }

    @ApiResponse({ type: () => Hl7ObjectsDto })
    @ApiOperation({ summary: 'Get list of hl7 objects' })
    @Roles(UserRoles.user)
    @Get()
    async getHl7ObjectList(@Query() query: GetUserHl7ObjectListDto, @Request() req: Request & { user: SessionDataDto }): Promise<Hl7ObjectsDto> {
        let hl7ObjectsList = [];
        const scopes: any[] = [
            { method: ['byUserId', req.user.userId] }
        ];

        if (query?.status?.length) {
            scopes.push({ method: ['byStatus', query.status] });
        }

        const count = await this.usersHl7ObjectsService.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit: query.limit, offset: query.offset }] },
                { method: ['orderBy', [['activatedAt', 'desc']]] },
                { method: ['withFiles'] },
            );
            hl7ObjectsList = await this.usersHl7ObjectsService.getList(scopes);
        }

        return new Hl7ObjectsDto(hl7ObjectsList, PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, count));
    }
}
