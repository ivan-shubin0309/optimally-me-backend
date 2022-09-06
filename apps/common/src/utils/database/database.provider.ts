import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '../config/config.service';

export const sequelizeProvider = (models) => ({
  provide: 'SEQUELIZE',
  useFactory: async (configService: ConfigService) => {
    const sequelize = new Sequelize({
      dialect: 'mysql',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
    });
    sequelize.addModels(models);
    await sequelize.sync();
    return sequelize;
  },
  inject: [ConfigService]
});