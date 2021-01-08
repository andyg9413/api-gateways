import { prop } from '@typegoose/typegoose';

export class GatewayModel {
  @prop({ default: () => new Date(new Date().toUTCString()) })
  createdAt?: Date;

  @prop({ default: () => new Date(new Date().toUTCString()) })
  updatedAt?: Date;

  id?: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  ip: string;

  @prop()
  devices: any[];
}
