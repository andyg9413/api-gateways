import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MongoCrudService } from '../mongo-rest/src/mongo-crud.service';
import { DeviceModel } from './models/device.model';
import { GatewaysService } from '../gateways/gateways.service';

@Injectable()
export class DevicesService extends MongoCrudService(DeviceModel) {
  constructor(
    @Inject(forwardRef(() => GatewaysService))
    private readonly gatewayService: GatewaysService,
  ) {
    super();
  }

  async delete(id: string): Promise<DeviceModel> {
    await this.gatewayService.gatewayModel.updateMany(
      {},
      { $pull: { devices: id } },
    );
    return await super.delete(id);
  }
}
