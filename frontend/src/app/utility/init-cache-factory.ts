import { CacheService } from "../services/cache.service";


export function InitCacheFactory(
  cacheService: CacheService
) {
  return () => {
    //console.log('InitCacheFactory - started');
    cacheService.clean();
  };
}
