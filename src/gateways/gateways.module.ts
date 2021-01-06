import { forwardRef, Module } from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { GatewaysController } from './gateways.controller';
import { GatewayModel } from './models/gateway.model';
import { DevicesModule } from '../devices/devices.module';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    forwardRef(() => DevicesModule),
    TypegooseModule.forFeature([GatewayModel]),
  ],
  controllers: [GatewaysController],
  providers: [GatewaysService],
  exports: [GatewaysService],
})
export class GatewaysModule {}
