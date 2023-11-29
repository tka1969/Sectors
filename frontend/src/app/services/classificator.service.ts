import { Injectable } from '@angular/core';
import { IClassificator } from '../models/classificator.interface';


const classificatorCache = new Map<string, IClassificator[]>();

@Injectable({
  providedIn: 'root'
})
export class ClassificatorService {

  put(classificators: IClassificator[]): void {
    classificators.forEach((classificator) => {
      var listClassificator: IClassificator[] | undefined =  classificatorCache.get(classificator.ParameterClass);

      if (listClassificator == undefined) {
        listClassificator = [];
      }
      listClassificator.push(classificator);
      classificatorCache.set(classificator.ParameterClass, listClassificator);
    });
  }

  public get(classificator: string): IClassificator[] {
    var listClassificator: IClassificator[] | undefined = classificatorCache.get(classificator);

    if (listClassificator == undefined) {
        listClassificator = [];
    }
    return listClassificator;
  }

}

