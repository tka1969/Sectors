import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CacheItem } from '../models/cache-item.model';
import { ResourceType } from '../types/resource.type';


@Injectable({
  providedIn: 'root'
})
export class CacheService {

  serviceCache: { [key: string]: CacheItem<any> } = {};

  constructor(
    ) {
  }

  cache<T>(
      returnObservable: () => Observable<ResourceType<T>>,
      key: string,
      upsert: boolean = false,
      refresh: boolean = false,
      customCache?: { [key: string]: CacheItem<ResourceType<T>> }
    ): Observable<ResourceType<T>> {

    const cache = (customCache || this.serviceCache);
    if (!refresh && cache[key] != null) {
      console.log('from cache: refresh=%o, key=%o, item=%o', refresh, key, cache[key].item);

      return cache[key].item as Observable<ResourceType<T>>;
    }
    const replay = new ReplaySubject<ResourceType<T>>(1);
    returnObservable().subscribe({
      next: (x: any) => {
          const cacheItem: CacheItem<ResourceType<T>> | null = this.get(key);
          if (cacheItem != null) {
            if (upsert) {
              cacheItem.upsertResource(x as ResourceType<T>);
            }
            else {
              cacheItem.setResources(x as ResourceType<T>[]);
            }
          }
          replay.next(x); },
      error: (x: any) => replay.error(x),
      complete: () => replay.complete()
    });
    const observable = replay.asObservable();
    cache[key] = new CacheItem<ResourceType<T>>(key, observable);
    return observable;
  }

  get<T>(key?: string, customCache?: { [key: string]: CacheItem<ResourceType<T>> }): CacheItem<ResourceType<T>> | null {
  const cache = (customCache || this.serviceCache);
    if (!!key && cache[key] != null) {
      return cache[key];
    }
    return null;
  }

  remove<T>(key?: string, customCache?: { [key: string]: CacheItem<ResourceType<T>> }): void {
    const cache = (customCache || this.serviceCache);
    if (!!key && cache[key]) {
      delete this.serviceCache[key];
    }
  }

  clean<T>(customCache?: { [key: string]: CacheItem<ResourceType<T>> }): void {
    const cache = (customCache || this.serviceCache);
    this.serviceCache = {};
  }

}
