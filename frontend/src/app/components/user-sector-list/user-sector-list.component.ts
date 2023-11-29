import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base/base/base.component';
import { IUserSector, createUserSector } from 'src/app/models/user-sector.interface';
import { UserSectorFacadeService } from 'src/app/services/user-sector-facade.service';
import { ActionEnum } from 'src/app/enums/action.enum';
import { IDataTableActionEvent } from 'src/app/modules/widgets/data-table/data-table-action-event.interface';
import { IDataTableAction, DataTableActionType } from 'src/app/modules/widgets/data-table/data-table-action.interface';
import { IDataTableColumn, DataTableColumnType } from 'src/app/modules/widgets/data-table/data-table-column.interface';
import { createQueryModel } from 'src/app/models/query.model';

@Component({
  selector: 'app-user-sector-list',
  templateUrl: './user-sector-list.component.html',
  styleUrls: ['./user-sector-list.component.scss']
})
export class UserSectorListComponent extends BaseComponent implements OnInit {

  userTableActions: IDataTableAction[] = [];
  userTableColumns: IDataTableColumn[] = [];

  constructor(
    public userService: UserSectorFacadeService
    ) { 
      super();
  }

  ngOnInit(): void {
    this.initializeUserSectorForm();
    this.loadData(true);
  }

  get service() {
    return this.userService;
  }

  override loadData(refresh: boolean): void {
    console.log('loadData.[DEBUG] refresh:%o', refresh);
    this.userService.query(createQueryModel(), refresh);
  }

  protected openUserSectorItemForm(event: IDataTableActionEvent) {
    this.formNavigate(
      "UserSectorListComponent",
      "/user-sector-item",
      "/user-sector-list",
      {
        action: event.action.action,
        payload: (event.action.action == ActionEnum.NEW)
                    ? createUserSector()
                    : event.payload as IUserSector
      });
  }

  userTableAction(event: IDataTableActionEvent) {
    this.openUserSectorItemForm(event);
  }

  userRowAction(event: IDataTableActionEvent) {
    this.openUserSectorItemForm(event);
  }


  initializeUserSectorForm(): void {

    this.userTableActions = [
      {
        type: DataTableActionType.BUTTON,
        name: "New User & Sector...",
        action: ActionEnum.NEW,
        icon: ['fas', 'eye'],
      },
    ];

    const userTableRowActions: IDataTableAction[] = [
      /*{
        type: DataTableActionType.ICON,
        name: "View",
        action: ActionEnum.VIEW,
        icon: ['fas', 'eye'],
      },*/
      {
        type: DataTableActionType.ICON,
        name: "Edit",
        action: ActionEnum.EDIT,
        icon: ['fas', 'edit'],
      },
    ];

    this.userTableColumns = [
      {
        dataKey: "",
        type: DataTableColumnType.ACTION,
        label: "Actions",
        position: 'left',
        width: "10%",
        actions: userTableRowActions
      },
      {
        dataKey: "IsTermsAgreed",
        type: DataTableColumnType.BOOLEAN,
        label: "Is Terms Agreed",
        position: 'left',
        width: "10%"
      },
      {
        dataKey: "Username",
        type: DataTableColumnType.TEXT,
        label: "Username",
        position: 'left',
        width: "65%"
      }
    ];
  }

}

