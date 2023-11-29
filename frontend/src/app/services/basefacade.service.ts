import { inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CacheItem } from '../models/cache-item.model';
import { ResourceService } from './resource.service';
import { BaseService } from './base.service';
import { QueryModel, queryKey } from '../models/query.model';
import { CacheService } from './cache.service';
import { ResourceType } from '../types/resource.type';



export class BaseFacadeService<T> extends ResourceService<T> {

  private cacheService = inject(CacheService);
  private cacheKey: string = '';

  constructor(
    protected service: BaseService<T>,
    protected keyprefix: string
      ) {
    super();
  }

  protected getCacheService = (): CacheService => {
    return this.cacheService;
  };

  cacheableCheckKey(key: string): void {
    if (key != this.cacheKey) {
      this.cacheService.remove(this.cacheKey);
      this.cacheKey = key;
    }
  }

  public cacheableGetKey = (): string => {
    return this.cacheKey;
  };

  upsertCacheResource(resource: ResourceType<T>, cacheKey: string) {
    this.upsertResource(resource);
    const cacheItem: CacheItem<ResourceType<T>> | null = this.cacheService.get(cacheKey);
    console.log('upsertCacheResource: cacheKey=%o, cacheItem=%o', cacheKey, cacheItem);
    if (cacheItem != null) {
      cacheItem.upsertResource(resource);
    }
  }

  removeCacheResource(id: number, cacheKey: string) {
    this.removeResource(id);
    const cacheItem: CacheItem<ResourceType<T>> | null = this.cacheService.get(cacheKey);

    console.log('removeCacheResource: cacheItem=%o', cacheItem);

    if (cacheItem != null) {
      cacheItem.removeResource(id);
    }
  }

  query(inquery: QueryModel, refresh: boolean = false, onQueryComplete?: (data: T[]) => void): Observable<T[]> {
    let replay = new ReplaySubject<T[]>(1);
    let observable = replay.asObservable();
    const cacheKey = queryKey(this.keyprefix, inquery);

    this.cacheableCheckKey(cacheKey);
    this.setLoading();
    this.cacheService.cache(() => this.service.query(inquery), this.cacheKey, false, refresh)
      .subscribe({
        next: (result: any[]) => {
            this.setResources(result);
            if (onQueryComplete !== undefined) {
              onQueryComplete(result);
            }
            replay.next(result);
          },
        error: (error: any) => { console.error('[ERROR] BaseFacadeService.query -> %o', error); this.setError(error); replay.error(error); },
        complete: () => { this.setLoaded(); replay.complete(); }
      });
      return observable;
  }

  get(id: number): Observable<T> {
    let replay = new ReplaySubject<T>(1);
    let observable = replay.asObservable();
    this.setLoading();
    this.service.get(id)
      .subscribe({
        next: (result: any) => {
            this.upsertCacheResource(result, this.cacheKey);
            replay.next(result);
          },
        error: (error: any) => { console.error('[ERROR] BaseFacadeService.get -> %o', error); this.setError(error); replay.error(error); },
        complete: () => { this.setLoaded(); replay.complete(); }
      });
      return observable;
  }

  update(param: T): Observable<T> {
    let replay = new ReplaySubject<T>(1);
    let observable = replay.asObservable();
    this.setLoading();
    this.service.update(param)
      .subscribe({
        next: (result: ResourceType<T>) => {
          console.log('update.[DEBUG] cacheKey: %o, result:%o', this.cacheKey, result);
            this.upsertCacheResource(result, this.cacheKey);

            
            replay.next(result);
          },
        error: (error: any) => { console.error('[ERROR] BaseFacadeService.update -> %o', error); this.setError(error); replay.error(error); },
        complete: () => { this.setLoaded(); replay.complete(); }
      });
      return observable;
  }

  bulkoperation(bulkparam: T[]): Observable<T[]> {
    let replay = new ReplaySubject<T[]>(1);
    let observable = replay.asObservable();
    this.setLoading();
    this.service.bulkoperation(bulkparam)
      .subscribe({
        next: (result: ResourceType<T[]>) => {
            replay.next(result);
          },
        error: (error: any) => { console.error('[ERROR] BaseFacadeService.update -> %o', error); this.setError(error); replay.error(error); },
        complete: () => { this.setLoaded(); replay.complete(); }
      });
      return observable;
  }
  
  
  delete(id: number): Observable<number> {
    let replay = new ReplaySubject<number>(1);
    let observable = replay.asObservable();
    console.log('delete.queryKey: key=%o', this.cacheKey);
    this.setLoading();
    this.service
      .delete(id)
      .subscribe({
        next: (result) => {
            this.removeCacheResource(id, this.cacheKey);
            replay.next(result);
          },
        error: (error: any) => { console.error('[ERROR] BaseFacadeService.delete -> %o', error); this.setError(error); replay.error(error); },
        complete: () => { this.setLoaded(); replay.complete(); }
      });
      return observable;
  }

}

