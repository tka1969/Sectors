
interface IResourceBaseObject {
    Id?: number;
  }
    
export type ResourceType<T> = T & IResourceBaseObject;

