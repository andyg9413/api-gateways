import { forwardRef, Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { DeviceModel } from './models/device.model';
import { GatewaysModule } from '../gateways/gateways.module';

@Module({
  imports: [
    forwardRef(() => GatewaysModule),
    TypegooseModule.forFeature([DeviceModel]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
