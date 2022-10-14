import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../../users/src/users.service';
import { GetListDto } from '../../common/src/models/get-list.dto';
import { PaginationHelper } from '../../common/src/utils/helpers/pagination.helper';
import { UsersDto } from '../../users/src/models/users.dto';
import { UserRoles } from '../../common/src/resources/users';
import { Roles } from '../../common/src/resources/common/role.decorator';

@ApiBearerAuth()
@ApiTags('admins/users')
@Controller('admins/users')
export class AdminsUsersController {
  constructor(
    readonly usersService: UsersService,
  ) { }

  @ApiResponse({ type: () => UsersDto })
  @ApiOperation({ summary: 'Get list of users' })
  @Roles(UserRoles.superAdmin)
  @Get()
  async getUserList(@Query() query: GetListDto): Promise<UsersDto> {
    const limit = parseInt(query.limit);
    const offset = parseInt(query.offset);

    let userList = [];
    const scopes: any[] = [{ method: ['byRoles', UserRoles.user] }];

    const count = await this.usersService.getCount(scopes);

    if (count) {
      scopes.push({ method: ['pagination', { limit, offset }] });
      userList = await this.usersService.getList(scopes);
    }

    return new UsersDto(userList, PaginationHelper.buildPagination({ limit, offset }, count));
  }
}
