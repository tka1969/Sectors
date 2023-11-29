import { Injectable } from '@angular/core';

import { BaseService } from './base.service';
import { IUserSector } from '../models/user-sector.interface';

@Injectable({
  providedIn: 'root'
})
export class UserSectorService extends BaseService<IUserSector> {

  constructor(
    ) {
    super('usersector');
  }
}
