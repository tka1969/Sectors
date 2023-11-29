import { signal } from "@angular/core";
import { CallState, FetchingState, IErrorState } from "../types/call-state.type";
import { ResourceType } from "../types/resource.type";


export class ResourceService<T> {

  resources = signal<ResourceType<T>[]>([], {equal: (a, b) => false});
  state = signal<CallState>(FetchingState.EMPTY);

  constructor() {
  }
   
  public getResources = (): ResourceType<T>[] => {
    return this.resources();
  };

  public isLoading = (): boolean => {
    return this.state() == FetchingState.LOADING;
  };

  public isLoaded = (): boolean => {
    return this.state() == FetchingState.LOADED;
  };

  public isError = (): boolean => {
    return (this.state() as IErrorState).errorMsg !== undefined;
  };

  public getError = (): string | null => {
      if ((this.state() as IErrorState).errorMsg !== undefined) {
          return (this.state() as IErrorState).errorMsg;
      }
      return null;
  };

  public setLoading = () => {
    this.state.set(FetchingState.LOADING);
  };

  public setLoaded = () => {
    this.state.set(FetchingState.LOADED);
  };

  public setError = (error: any) => {
    this.state.set({errorMsg: error});
  };

  public setResources = (resources: ResourceType<T>[]) => {
    this.resources.set(resources);
  };

  public upsertResource = (resource: ResourceType<T>) => {

    const index = this.resources().findIndex((item) => item.Id === resource.Id);
    if (index === -1) {
      console.log('ResourceService.upsertResource: add resource=%o', resource);
      this.resources.mutate((value) => (value = [...value, resource]));
    }
    else {
      console.log('ResourceService.upsertResource: update resource=%o', resource);
      this.resources.mutate((value) => (value[index] = resource));
    }
  };

  protected removeResource = (id: number) => {
    console.log('ResourceService.removeResource: id=%o', id);
    this.resources.set(this.resources().filter((item) => item.Id !== id))
  };
}

