import { Body, Controller, Param, Post, Put, Delete } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { CrudController } from '../mongo-rest/src/crud.controller';
import { DeviceModel } from './models/device.model';
import { ApiTags } from '@nestjs/swagger';

@Controller('devices')
@ApiTags('Devices')
export class DevicesController extends CrudController(DevicesService, {
  createDto: CreateDeviceDto,
  modelDto: DeviceModel,
  updateDto: UpdateDeviceDto,
}) {
  constructor(private readonly devicesService: DevicesService) {
    super();
  }

  @Post()
  async create(@Body() dto: CreateDeviceDto): Promise<DeviceModel> {
    return await this.devicesService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDeviceDto,
  ): Promise<DeviceModel> {
    return await this.devicesService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<DeviceModel> {
    return await this.devicesService.delete(id);
  }
}
