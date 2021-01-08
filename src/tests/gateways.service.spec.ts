import { Test, TestingModule } from '@nestjs/testing';
import { GatewaysService } from '../gateways/gateways.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { GatewayModel } from '../gateways/models/gateway.model';
import { MongoMemoryServer } from 'mongodb-memory-server-core';
import { CreateGatewayDto } from '../gateways/dto/create-gateway.dto';
import { UpdateGatewayDto } from '../gateways/dto/update-gateway.dto';
import { DevicesService } from '../devices/devices.service';
import { DeviceModel } from '../devices/models/device.model';
import { Types } from 'mongoose';

describe('GatewaysService', () => {
  let service: GatewaysService;
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
      providers: [GatewaysService, DevicesService],
    }).compile();

    service = module.get<GatewaysService>(GatewaysService);
  });

  it('should create a gateway', async () => {
    const dto: CreateGatewayDto = {
      name: 'TestGateway',
      ip: '127.0.0.0',
    };
    const output = await service.create(dto);
    expect(output).toHaveProperty('id');
    expect(output).toHaveProperty('name', 'TestGateway');
    expect(output).toHaveProperty('ip', '127.0.0.0');
    expect(output).toHaveProperty('createdAt');
  });

  it('should get all gateways', async () => {
    const output = await service.getAllGateways({ skip: 0 });
    console.log(output);
    expect(output.data[0]).toHaveProperty('_id');
    expect(output.data[0]).toHaveProperty('name', 'TestGateway');
    expect(output.data[0]).toHaveProperty('ip', '127.0.0.0');
  });

  it('should get one gateway by dto', async () => {
    const output = await service.getOne({ name: 'TestGateway' });
    expect(output).toHaveProperty('id');
    expect(output).toHaveProperty('name', 'TestGateway');
    expect(output).toHaveProperty('ip', '127.0.0.0');
    expect(output).toHaveProperty('createdAt');
  });

  it('should get one gateway by id', async () => {
    const gateway = await service.getOne({ name: 'TestGateway' });
    const output = await service.getOneGateway(gateway.id);
    expect(output).toHaveProperty('_id', Types.ObjectId(gateway.id));
    expect(output).toHaveProperty('name', 'TestGateway');
    expect(output).toHaveProperty('ip', '127.0.0.0');
  });

  it('should update a gateway', async () => {
    const gateway = await service.getOne({ name: 'TestGateway' });
    const dto: UpdateGatewayDto = {
      name: 'ChangedTestGateway',
      ip: '127.0.1.8',
    };
    const output = await service.update(gateway.id, dto);
    expect(output).toHaveProperty('id', gateway.id);
    expect(output).toHaveProperty('name', 'ChangedTestGateway');
    expect(output).toHaveProperty('ip', '127.0.1.8');
    expect(output).toHaveProperty('createdAt');
    expect(output).toHaveProperty('updatedAt');
  });

  it('should delete one gateway by id', async () => {
    const gateway = await service.getOne({ name: 'ChangedTestGateway' });
    const output = await service.delete(gateway.id);

    expect(output).toHaveProperty('id', gateway.id);
    expect(output).toHaveProperty('name', 'ChangedTestGateway');
    expect(output).toHaveProperty('ip', '127.0.1.8');
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
