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
    const { name, ip } = dto;

    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid gateway id');

    const gateway: GatewayModel = await super.get(id);

    if (!gateway) throw new NotFoundException('Gateway not found');

    if (name) gateway.name = name;
    if (ip) gateway.ip = ip;

    return await super.update(id, gateway);
  }

  async getAllGateways(query: GetAllQueryDto): Promise<GetAllResponseDto> {
    const queryParsed = RequestParserService.parseQuery(query);

    const aggregate = [
      { $unwind: { path: '$devices', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          deviceId: { $toObjectId: '$devices' },
        },
      },
      {
        $lookup: {
          from: 'devicemodels',
          let: {
            device: '$deviceId',
          },
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$device'] } } }],
          as: 'device',
        },
      },
      { $unwind: { path: '$device', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          ip: { $first: '$ip' },
          devices: { $push: '$device' },
        },
      },
      {
        $project: {
          name: 1,
          ip: 1,
          devices: 1,
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

  async getOneGateway(id: string): Promise<any> {
    const aggregate = [
      { $match: { _id: Types.ObjectId(id) } },
      { $unwind: { path: '$devices', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          deviceId: { $toObjectId: '$devices' },
        },
      },
      {
        $lookup: {
          from: 'devicemodels',
          let: {
            device: '$deviceId',
          },
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$device'] } } }],
          as: 'device',
        },
      },
      { $unwind: { path: '$device', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          ip: { $first: '$ip' },
          devices: { $push: '$device' },
        },
      },
      {
        $project: {
          name: 1,
          ip: 1,
          devices: 1,
        },
      },
    ];

    const data = await this.gatewayModel.aggregate(aggregate).exec();
    return data ? data[0] : null;
  }

  async delete(id: string): Promise<GatewayModel> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid gateway id');

    const gateway: GatewayModel = await super.get(id);

    if (!gateway) throw new NotFoundException('Gateway not found');
    
    this.devicesService.deleteMany(gateway.devices);
    await super.delete(id);

    return gateway;
  }
}
