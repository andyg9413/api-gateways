import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from '../models/status.enum';

export class UpdateDeviceDto {
  @IsString()
  @IsOptional()
  vendor?: string;

  @IsEnum(StatusEnum)
  @IsOptional()
  status?: StatusEnum;
}
