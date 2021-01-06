import { DefaultValue } from '../utils/default-value.enum';

export class GetAllQueryDto {
  skip?: number = DefaultValue.Skip;
  limit?: number = DefaultValue.Limit;
}
