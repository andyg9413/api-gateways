import {
  Post,
  Get,
  Inject,
  Param,
  Body,
  Put,
  Delete,
  Type,
  Query,
  Req,
} from '@nestjs/common';
import { ICrudService, ICrudController } from './interfaces';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { GetAllResponseDto, GetAllQueryDto } from './dto';
import { RequestParserService } from './request-parser.service';

export interface CrudControllerConfig {
  modelDto: any;
  createDto: any;
  updateDto?: any;
}

export function CrudController(
  service: any,
  config: CrudControllerConfig,
): Type<ICrudController> {
  class MongoRestControllerHost implements ICrudController {
    @Inject(service) readonly crudService: ICrudService;

    service() {
      return this.crudService;
    }

    @ApiResponse({
      status: 200,
      description: 'The found records',
      type: [config.modelDto],
    })
    @ApiBadRequestResponse()
    @ApiInternalServerErrorResponse()
    @Get()
    async getAll(
      @Query() query: GetAllQueryDto,
      dto?: any,
      @Req() request?: any,
    ): Promise<GetAllResponseDto> {
      const queryParsed = RequestParserService.parseQuery(query);
      const data = await this.crudService.getAll(queryParsed, dto);
      const count = await this.crudService.count(queryParsed, dto);
      return {
        data,
        count: data.length,
        total: count,
      };
    }

    @ApiResponse({
      status: 200,
      description: 'The found record',
      type: config.modelDto,
    })
    @ApiNotFoundResponse()
    @Get(':id')
    async get(@Param('id') id: string): Promise<any> {
      return await this.crudService.get(id);
    }

    @ApiBody({
      type: config.createDto,
    })
    @ApiResponse({
      status: 201,
      description: 'The created record',
      type: config.modelDto,
    })
    @ApiBadRequestResponse()
    @ApiInternalServerErrorResponse()
    @Post()
    async create(@Body() dto: any, @Req() request?: any): Promise<any> {
      return await this.crudService.create(dto);
    }

    @ApiBody({
      type: config.updateDto || config.createDto,
    })
    @ApiResponse({
      status: 200,
      description: 'The updated record',
      type: config.modelDto,
    })
    @ApiBadRequestResponse()
    @ApiInternalServerErrorResponse()
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() dto: any,
      @Req() request?: any,
    ): Promise<any> {
      return await this.crudService.update(id, dto);
    }

    @ApiResponse({
      status: 200,
      description: 'The deleted record',
      type: config.modelDto,
    })
    @Delete(':id')
    @ApiNotFoundResponse()
    async delete(@Param('id') id: string, @Req() request?: any): Promise<any> {
      return await this.crudService.delete(id);
    }
  }

  return MongoRestControllerHost;
}
