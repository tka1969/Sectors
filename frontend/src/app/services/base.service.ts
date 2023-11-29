import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResourceType } from '../types/resource.type';
import { QueryModel } from '../models/query.model';


export class BaseService<T> {
  
  httpclient = inject(HttpClient);

  constructor(public service: String) {}

  protected getServiceV1Url(): string {

    /*switch (this.service)
    {
      case 'sector':
        {
          if (environment.use_mock_query_sector) {
            return environment.mock_query_sector;        
          }
          break;
        }
    }*/

    return environment.apiUrl + environment.apiV1 + this.service + '/';
  }

  query(params: QueryModel): Observable<T[]> {
    return this.httpclient.post<T[]>(this.getServiceV1Url() + 'query', params);
  }

  get(id: number): Observable<T> {
    return this.httpclient.get<T>(this.getServiceV1Url() + 'get/' + id);
  }

  update(param: T): Observable<ResourceType<T>> {
    return this.httpclient.put<ResourceType<T>>(this.getServiceV1Url() + 'update', param);
  }

  delete(id: number): Observable<any> {
    return this.httpclient.delete<any>(this.getServiceV1Url() + 'delete/' + id);
  }

  bulkoperation(bulkparam: T[]): Observable<T[]> {
    return this.httpclient.post<T[]>(this.getServiceV1Url() + 'bulkoperation', bulkparam);
  }
  
}
