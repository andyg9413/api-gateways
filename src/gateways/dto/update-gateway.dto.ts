import {
  ArrayMaxSize,
  IsArray,
  IsIP,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateGatewayDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsIP(4)
  @IsOptional()
  ip?: string;
}
