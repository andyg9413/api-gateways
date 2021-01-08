import { Test, TestingModule } from '@nestjs/testing';
import { DevicesService } from '../devices/devices.service';
import { GatewaysService } from '../gateways/gateways.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { GatewayModel } from '../gateways/models/gateway.model';
import { DeviceModel } from '../devices/models/device.model';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { CreateDeviceDto } from '../devices/dto/create-device.dto';
import { StatusEnum } from '../devices/models/status.enum';
import { UpdateDeviceDto } from '../devices/dto/update-device.dto';

describe('DeviceService', () => {
  let service: DevicesService;
  let mongoServer;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypegooseModule.forRoot(await mongoServer.getUri(), {
          useNewUrlParser: true,
          useFindAndModify: false,
        }),
        TypegooseModule.forFeature([GatewayModel, DeviceModel]),
      ],
      providers: [DevicesService, GatewaysService],
    }).compile();

    service = module.get<DevicesService>(DevicesService);
  });

  it('should create a device', async () => {
    const dto: CreateDeviceDto = {
      status: StatusEnum.OFFLINE,
      vendor: 'Max Payne',
    };
    const output = await service.create(dto);
    expect(output).toHaveProperty('id');
    expect(output).toHaveProperty('vendor', 'Max Payne');
    expect(output).toHaveProperty('status', StatusEnum.OFFLINE);
    expect(output).toHaveProperty('createdAt');
  });

  it('should get all devices', async () => {
    const output = await service.getAll({ skip: 0, limit: -1 });
    expect(output[0]).toHaveProperty('id');
    expect(output[0]).toHaveProperty('vendor', 'Max Payne');
    expect(output[0]).toHaveProperty('status', StatusEnum.OFFLINE);
    expect(output[0]).toHaveProperty('createdAt');
  });

  it('should get one device by dto', async () => {
    const output = await service.getOne({ vendor: 'Max Payne' });
    expect(output).toHaveProperty('id');
    expect(output).toHaveProperty('vendor', 'Max Payne');
    expect(output).toHaveProperty('status', StatusEnum.OFFLINE);
    expect(output).toHaveProperty('createdAt');
  });

  it('should get one device by id', async () => {
    const device = await service.getOne({ vendor: 'Max Payne' });
    const output = await service.get(device.id);
    expect(output).toHaveProperty('id', device.id);
    expect(output).toHaveProperty('vendor', 'Max Payne');
    expect(output).toHaveProperty('status', StatusEnum.OFFLINE);
    expect(output).toHaveProperty('createdAt');
  });

  it('should update a device', async () => {
    const device = await service.getOne({ vendor: 'Max Payne' });
    const dto: UpdateDeviceDto = {
      status: StatusEnum.ONLINE,
      vendor: 'John Doe',
    };
    const output = await service.update(device.id, dto);
    expect(output).toHaveProperty('id', device.id);
    expect(output).toHaveProperty('vendor', 'John Doe');
    expect(output).toHaveProperty('status', StatusEnum.ONLINE);
    expect(output).toHaveProperty('createdAt');
    expect(output).toHaveProperty('updatedAt');
  });

  it('should get one device by id', async () => {
    const device = await service.getOne({ vendor: 'John Doe' });
    const output = await service.delete(device.id);

    expect(output).toHaveProperty('id', device.id);
    expect(output).toHaveProperty('vendor', 'John Doe');
    expect(output).toHaveProperty('status', StatusEnum.ONLINE);
    expect(output).toHaveProperty('createdAt');
    expect(output).toHaveProperty('updatedAt');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  afterAll(async () => {
    mongoServer.stop();
  });
});
