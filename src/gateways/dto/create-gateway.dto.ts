import {
  IsArray,
  IsIP,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateGatewayDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIP(4)
  @IsNotEmpty()
  ip: string;

  @IsArray({ each: true })
  @IsOptional()
  @MaxLength(10)
  devices?: any[];
}
