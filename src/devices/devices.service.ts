import { forwardRef, Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MongoCrudService } from '../mongo-rest/src/mongo-crud.service';
import { DeviceModel } from './models/device.model';
import { GatewaysService } from '../gateways/gateways.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { GatewayModel } from 'src/gateways/models/gateway.model';
import { Types } from 'mongoose';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DevicesService extends MongoCrudService(DeviceModel) {
  constructor(
    @Inject(forwardRef(() => GatewaysService))
    private readonly gatewayService: GatewaysService,
  ) {
    super();
  }

  async delete(id: string): Promise<DeviceModel> {
    const device: DeviceModel = super.get(id);

    if(!device){
      throw new NotFoundException('Device not found');
    }

    const oldGateway: GatewayModel = await this.gatewayService.getOne({devices: {$in: [device.id]}});
    console.log(oldGateway);
    const devices = oldGateway.devices.filter(element => {
      if(element !== Types.ObjectId(id)) 
        return element;
    });
    const updatedOldGateway = {
      ...oldGateway,
      devices,
    };
      
    await this.gatewayService.update(oldGateway.id, updatedOldGateway);

    return await super.delete(id);
  }

  async deleteMany(ids: Array<string>): Promise<DeviceModel> {
    return await super.deleteMany(ids);
  }

  async create(dto: CreateDeviceDto): Promise<DeviceModel> {
    if(!dto.gatewayId){
      throw new BadRequestException('gatewayId should be defined');
    }

    if(!Types.ObjectId.isValid(dto.gatewayId)){
      throw new BadRequestException('gatewayId should be an ObjectId');
    }

    const gateways: GatewayModel = await this.gatewayService.get(dto.gatewayId);
    if(!gateways){
      throw new NotFoundException('Does not exist any gateway with the id provided');
    }

    if(gateways.devices.length > 9){
      throw new BadRequestException('The number of services associated with a gateway cannot exceed 10.');
    }

    const device: DeviceModel = await super.create(dto);
    gateways.devices.push(Types.ObjectId(device.id));
    await this.gatewayService.update(dto.gatewayId, gateways);

    return device;
  }

  async update(id: string, dto: UpdateDeviceDto): Promise<DeviceModel> {
    const lastDevice = await super.get(id);

    if(!lastDevice){
      throw new NotFoundException('Device not found');
    }

    if(dto.gatewayId){
  
      if(!Types.ObjectId.isValid(dto.gatewayId)){
        throw new BadRequestException('gatewayId should be an ObjectId');
      }
  
      const newGateway: GatewayModel = await this.gatewayService.get(dto.gatewayId);
      if(!newGateway){
        throw new NotFoundException('Does not exist any gateway with the id provided');
      }

      if(newGateway.devices.length > 9){
        throw new BadRequestException('The number of services associated with a gateway cannot exceed 10.');
      }

      console.log(id);
      
      const oldGateway: GatewayModel = await this.gatewayService.getOne({devices: {$in: [lastDevice.id]}});
      console.log(oldGateway);
      
      const devices = oldGateway.devices.filter(element => {
        if(element !== Types.ObjectId(id)) 
          return element;
      });
      const updatedOldGateway = {
        ...oldGateway,
        devices,
      };

      await this.gatewayService.update(oldGateway.id, updatedOldGateway);
      newGateway.devices.push(Types.ObjectId(id));
      await this.gatewayService.update(dto.gatewayId, newGateway);
    }

    const device = await super.update(id, dto);

    return device;
  }
}
