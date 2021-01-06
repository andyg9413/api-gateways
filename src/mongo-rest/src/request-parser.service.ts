import { GetAllQueryParsedDto } from './interfaces';
import { GetAllQueryDto } from './dto';

export class RequestParserService {
  static parseQuery(query: GetAllQueryDto): GetAllQueryParsedDto {
    return {
      limit: Number(query.limit || 10),
      skip: Number(query.skip || 0),
    };
  }
}
