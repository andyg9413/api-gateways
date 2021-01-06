import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoCrudService } from '../mongo-rest/src/mongo-crud.service';
import { GatewayModel } from './models/gateway.model';
import { DevicesService } from '../devices/devices.service';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { GetAllQueryDto, GetAllResponseDto } from '../mongo-rest/src/dto';
import { RequestParserService } from '../mongo-rest/src/request-parser.service';

@Injectable()
export class GatewaysService extends MongoCrudService(GatewayModel) {
  constructor(
    @InjectModel(GatewayModel)
    public readonly gatewayModel: ReturnModelType<typeof GatewayModel>,
    @Inject(forwardRef(() => DevicesService))
    private readonly devicesService: DevicesService,
  ) {
    super();
  }
  async update(id: string, dto: UpdateGatewayDto): Promise<GatewayModel> {
    const { devices, name, ip } = dto;

    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid gateway id');

    const gateway: GatewayModel = await super.get(id);

    if (!gateway) throw new NotFoundException('Gateway not found');

    if (name) gateway.name = name;
    if (ip) gateway.ip = ip;

    const devicesArray = gateway.devices;

    if (devices && devices.length > 0) {
      for (const device of devices) {
        if (!Types.ObjectId.isValid(device)) {
          throw new BadRequestException('Some invalid id');
        }
        const found = await this.devicesService.get(device);
        if (!found) {
          throw new NotFoundException('Some device not exists');
        }
        const index = gateway.devices?.findIndex(
          (d) => d.toString() === device.toString(),
        );
        if (index === -1) {
          devicesArray.push(device);
        } else {
          devicesArray.splice(index, 1);
        }
      }
    }
    if (devicesArray.length > 10)
      throw new BadRequestException('Max size of devices must be 10');
    return await super.update(id, { ...gateway, devices: devicesArray });
  }

  async getAllGateways(query: GetAllQueryDto): Promise<GetAllResponseDto> {
    const queryParsed = RequestParserService.parseQuery(query);

    const aggregate = [
      { $unwind: { path: '$devices', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'devicemodels',
          localField: 'devices',
          foreignField: '_id',
          as: 'device',
        },
      },
      { $unwind: { path: '$device', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          ip: 1,
          device: 1,
        },
      },
    ];

    const data = await this.gatewayModel
      .aggregate(aggregate)
      .skip(queryParsed.skip)
      .limit(queryParsed.limit)
      .exec();
    const total = await super.count(queryParsed);
    const count = data.length;
    return {
      data,
      count,
      total,
    };
  }
}
