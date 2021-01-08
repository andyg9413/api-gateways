import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { StatusEnum } from '../models/status.enum';

export class CreateDeviceDto {
  @IsString()
  @IsNotEmpty()
  gatewayId: string;

  @IsString()
  @IsNotEmpty()
  vendor: string;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;
}
