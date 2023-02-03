import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../common/src/strategies/jwt.strategy';
import { entities } from '../../common/src/utils/database/database-entity.provider';
import { sequelizeProvider } from '../../common/src/utils/database/database.provider';
import { guardProviders } from '../../common/src/utils/guards/guard.provider';
import { SessionsService } from '../../sessions/src/sessions.service';
import { UsersService } from '../../users/src/users.service';
import { modelProviders } from './models.provider';
import { TypeformController } from './typeform.controller';
import { TypeformService } from './typeform.service';
import { UserQuizesService } from './user-quizes.service';

@Module({
  imports: [],
  controllers: [TypeformController],
  providers: [
    TypeformService,
    SessionsService,
    UsersService,
    JwtStrategy,
    UserQuizesService,
    ...guardProviders,
    sequelizeProvider(entities),
    ...modelProviders
  ],
})
export class TypeformModule { }
