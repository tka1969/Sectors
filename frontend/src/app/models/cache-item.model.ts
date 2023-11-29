import { Observable } from "rxjs";
import { ResourceType } from "../types/resource.type";


export class CacheItem<T> {
    private _flags: number;
    public key: string;
    public items: ResourceType<T>[] = [];
    public extended: any[] = [];
    public item: Observable<T>;
    public timeToLive: Date;
  
    constructor(key: string, item: Observable<T>) {
      this._flags = 0;
      this.key = key;
      this.item = item;
      this.timeToLive = new Date();
    }

    public testFlag(flag: number | 0): boolean {
      return (this._flags & flag) != 0;
    }

    public setFlag(flag: number | 0) {
        this._flags |= flag;
    }

    public clearFlag(flag: number | 0) {
        this._flags &= (~flag);
    }

    public setResources(resources: ResourceType<T>[]) {
      this.items = resources;
    }
  
    public upsertResource(resource: ResourceType<T>): void {

      const index = this.items.findIndex((item) => item.Id === resource.Id);
      if (index === -1) {
        this.items = [...this.items, resource];
      }
      else {
        this.items[index] = resource;
      }
    }
  
    public removeResource(id: number) {
      this.items = this.items.filter((item) => item.Id !== id);
    }
  }
