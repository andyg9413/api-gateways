import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import * as dotenv from 'dotenv';
import { DeviceModel } from './models/device.model';
import { GatewayModel } from './models/gateway.model';
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
    TypegooseModule.forFeature([DeviceModel, GatewayModel]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
