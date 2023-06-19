import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionDataDto } from '../../sessions/src/models';
import { Roles } from '../../common/src/resources/common/role.decorator';
import { UserRoles } from '../../common/src/resources/users';
import { DnaAgeResultsDto } from './models/dna-age-results.dto';
import { UsersDnaAgeService } from './users-dna-age.service';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { GetDnaAgeResultListDto } from './models/get-dna-age-result-list.dto';
import { EntityByIdDto } from '../../common/src/models/entity-by-id.dto';
import { UsersResultsService } from '../../users-results/src/users-results.service';
import { GetResultsByDnaAgeIdDto } from './models/get-results-by-dna-age-id.dto';
import { UserResultsDto } from '../../admins-results/src/models/user-results.dto';
import { TranslatorService } from 'nestjs-translator';

@ApiBearerAuth()
@ApiTags('users/dna-age')
@Controller('users/dna-age')
export class UsersDnaAgeController {
    constructor(
        private readonly usersDnaAgeService: UsersDnaAgeService,
        private readonly usersResultsService: UsersResultsService,
        private readonly translator: TranslatorService,
    ) { }

    @ApiResponse({ type: () => DnaAgeResultsDto })
    @ApiOperation({ summary: 'Get dna age dates' })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRoles.user)
    @Get('')
    async getDnaAgeDates(@Request() req: Request & { user: SessionDataDto }, @Query() query: GetDnaAgeResultListDto): Promise<DnaAgeResultsDto> {
        let dnaAgeResults = [], count = 0;

        const scopes: any[] = [
            { method: ['byUserId', req.user.userId] }
        ];

        if (query.startDate || query.endDate) {
            scopes.push({ method: ['byDate', query.startDate, query.endDate] });
        }

        count = await this.usersDnaAgeService.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit: query.limit, offset: query.offset }] },
                { method: ['orderBy', [['createdAt', 'desc']]] },
            );

            dnaAgeResults = await this.usersDnaAgeService.getList(scopes);
        }

        return new DnaAgeResultsDto(dnaAgeResults, PaginationHelper.buildPagination({ limit: query.limit, offset: query.offset }, count));
    }

    @ApiResponse({ type: () => UserResultsDto })
    @ApiOperation({ summary: 'Get dna age results by id' })
    @HttpCode(HttpStatus.OK)
    @Roles(UserRoles.user)
    @Get(':id/results')
    async getDnaAgeResultsById(@Param() param: EntityByIdDto, @Query() query: GetResultsByDnaAgeIdDto, @Request() req: Request & { user: SessionDataDto }): Promise<UserResultsDto> {
        const { limit, offset } = query;

        const skinResult = await this.usersDnaAgeService.getList([
            { method: ['byId', param.id] },
            { method: ['byUserId', req.user.userId] }
        ]);

        if (!skinResult) {
            throw new NotFoundException({
                message: this.translator.translate('DNA_AGE_RESULT_NOT_FOUND'),
                errorCode: 'DNA_AGE_RESULT_NOT_FOUND',
                statusCode: HttpStatus.BAD_REQUEST
            });
        }

        let userResultsList = [];
        const scopes: any[] = [
            { method: ['bySkinUserResultId', param.id] },
            { method: ['byUserId', req.user.userId] }
        ];

        const count = await this.usersResultsService.getCount(scopes);

        if (count) {
            scopes.push(
                { method: ['pagination', { limit, offset }] },
                { method: ['orderBy', [[query.orderBy, query.orderType]]] },
                'withUnit',
                'withBiomarker',
                'withFilter',
            );
            userResultsList = await this.usersResultsService.getList(scopes);
        }

        return new UserResultsDto(userResultsList, PaginationHelper.buildPagination({ limit, offset }, count));
    }
}
