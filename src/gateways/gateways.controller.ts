import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { GatewaysService } from './gateways.service';
import { CreateGatewayDto } from './dto/create-gateway.dto';
import { UpdateGatewayDto } from './dto/update-gateway.dto';
import { CrudController } from '../mongo-rest/src/crud.controller';
import { GatewayModel } from './models/gateway.model';
import { GetAllQueryDto, GetAllResponseDto } from '../mongo-rest/src/dto';

@Controller('gateways')
export class GatewaysController extends CrudController(GatewaysService, {
  updateDto: UpdateGatewayDto,
  modelDto: GatewayModel,
  createDto: CreateGatewayDto,
}) {
  constructor(private readonly gatewaysService: GatewaysService) {
    super();
  }

  @Post()
  async create(@Body() createGatewayDto: CreateGatewayDto) {
    return super.create(createGatewayDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGatewayDto: UpdateGatewayDto,
  ) {
    return this.gatewaysService.update(id, updateGatewayDto);
  }

  @Get()
  async getAll(@Query() query: GetAllQueryDto): Promise<GetAllResponseDto> {
    return this.gatewaysService.getAllGateways(query);
  }

  @Get(':id')
  async getOneGateway(@Param('id') id: string): Promise<GatewayModel> {
    return this.gatewaysService.getOneGateway(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<GatewayModel> {
    return this.gatewaysService.delete(id);
  }
}
