import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { ISector } from '../models/sector.interface';

@Injectable({
  providedIn: 'root'
})
export class SectorService extends BaseService<ISector> {

  constructor(
    ) {
    super('sector');
  }
}
