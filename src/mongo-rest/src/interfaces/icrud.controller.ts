import { GetAllResponseDto, GetAllQueryDto } from '../dto';

export interface ICrudController {
  get(id: any, request?: any, i18n?: any): any;
  getAll(
    query: GetAllQueryDto,
    dto?: any,
    request?: any,
  ): Promise<GetAllResponseDto>;

  create(dto: any, request?: any): any;
  update(id: any, dto: any, request?: any, i18n?: any): any;
  delete(id: any, request?: any, i18n?: any): any;
  service(): any;
}
