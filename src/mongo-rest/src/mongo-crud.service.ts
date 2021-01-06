import { GetAllQueryParsedDto, ICrudService } from './interfaces';
import { InjectModel } from 'nestjs-typegoose';
import { Model, Types } from 'mongoose';
import { Type } from '@nestjs/common';
import { TypegooseClass } from 'nestjs-typegoose/dist/typegoose-class.interface';

export function MongoCrudService<T>(
  typegooseModel: TypegooseClass,
): Type<ICrudService> {
  class MongoCrudServiceHost implements ICrudService {
    @InjectModel(typegooseModel) private readonly model: Model<any>;

    async get(id: string | Types.ObjectId): Promise<any> {
      id = typeof id === 'string' ? Types.ObjectId(id) : id;
      return await this.model.findOne({ _id: id }).exec();
    }

    async getOne(dto: any): Promise<any> {
      return await this.model.findOne(dto).exec();
    }

    async getAll(
      query: GetAllQueryParsedDto,
      dto?: any,
      sort?: any,
    ): Promise<any[]> {
      const mongoQuery = this.model.find({ ...dto }).skip(query.skip);

      if (query.limit !== -1) {
        mongoQuery.limit(query.limit);
      }

      if (sort) {
        mongoQuery.sort(sort);
      }
      return await mongoQuery.exec();
    }

    async count(query: GetAllQueryParsedDto, dto?: any): Promise<number> {
      let criteria: any = {};
      if (dto) {
        criteria = { ...criteria, ...dto };
      }
      const mongoQuery = this.model.countDocuments(criteria);
      return await mongoQuery.exec();
    }

    async create(dto: any): Promise<any> {
      return await this.model.create(dto);
    }

    async update(id: any, dto: any): Promise<any> {
      return await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    }

    async delete(id: any): Promise<any> {
      return await this.model.findByIdAndDelete(id).exec();
    }
  }

  return MongoCrudServiceHost;
}
