import { GetAllQueryParsedDto } from './get-all-query-parsed.dto';

export interface ICrudService {
  get(id: any, projection?: any): any;
  getOne(dto: any, projection?: any): any;
  getAll(query: GetAllQueryParsedDto, dto?: any, sort?: any): Promise<any[]>;
  count(query: GetAllQueryParsedDto, dto?: any): Promise<number>;

  create(dto: any): any;
  update(id: any, dto: any): any;
  delete(id: any): any;
  deleteMany(id: any): any;
}
