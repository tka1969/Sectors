import { Injectable } from '@angular/core';
import { BaseFacadeService } from './basefacade.service';
import { IUserSector } from '../models/user-sector.interface';
import { UserSectorService } from './user-sector.service';


@Injectable({
  providedIn: "root"
})
export class UserSectorFacadeService extends BaseFacadeService<IUserSector> {

  constructor(
    private userService: UserSectorService
    ) {
    super(userService, 'usersector-query');
  }
}
