import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminsResultsService } from './admins-results.service';

@ApiTags('admins/users/results')
@Controller('admins/users')
export class AdminsResultsController {
  constructor(private readonly adminsResultsService: AdminsResultsService) { }

  @Post('/:id/results')
  async createResult() {

  }
}
