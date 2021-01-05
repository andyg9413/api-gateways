import { prop } from '@typegoose/typegoose';
import { StatusEnum } from './status.enum';

export class DeviceModel {
  @prop({ default: () => new Date(new Date().toUTCString()) })
  createdAt?: Date;

  @prop({ default: () => new Date(new Date().toUTCString()) })
  updatedAt?: Date;

  id?: string;

  @prop({ required: true })
  vendor: string;

  @prop({
    required: true,
    enum: StatusEnum,
    default: StatusEnum.OFFLINE,
  })
  status: StatusEnum;
}
