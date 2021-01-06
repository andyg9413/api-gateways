import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import * as dotenv from 'dotenv';
import { DevicesModule } from './devices/devices.module';
import { GatewaysModule } from './gateways/gateways.module';
dotenv.config();
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    DevicesModule,
    GatewaysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
