import { Injectable } from '@angular/core';
import { BaseFacadeService } from './basefacade.service';
import { ISector } from '../models/sector.interface';
import { SectorService } from './sector.service';


@Injectable({
  providedIn: "root"
})
export class SectorFacadeService extends BaseFacadeService<ISector> {

  constructor(
    private sectorService: SectorService
    ) {
    super(sectorService, 'sector-query');
  }
}
