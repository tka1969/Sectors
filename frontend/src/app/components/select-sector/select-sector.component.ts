import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base/base/base.component';
import { ActionEnum, FormActionIndexEnum } from 'src/app/enums/action.enum';
import { ISector } from 'src/app/models/sector.interface';
import { IDataTableActionEvent } from 'src/app/modules/widgets/data-table/data-table-action-event.interface';
import { IDataTableAction, DataTableActionType } from 'src/app/modules/widgets/data-table/data-table-action.interface';
import { IDataTableColumn, DataTableColumnType } from 'src/app/modules/widgets/data-table/data-table-column.interface';
import { IUserSector, createUserSector } from 'src/app/models/user-sector.interface';
import { IClassificator } from 'src/app/models/classificator.interface';
import { ClassificatorService } from 'src/app/services/classificator.service';
import { SectorFacadeService } from 'src/app/services/sector-facade.service';
import { AlertService } from 'src/app/modules/widgets/alert-panel/alert-panel.servicent';
import { DataRowOperation } from 'src/app/enums/data-row-operation.enum';


export interface ISectorChoice {
  Id: number;
  SectorId: number;
  SectorName: string;
  Selected: boolean;
  RowState?: DataRowOperation;
}


@Component({
  selector: 'app-select-sector',
  templateUrl: './select-sector.component.html',
  styleUrls: ['./select-sector.component.scss']
})
export class SelectSectorComponent extends BaseComponent implements OnInit {

  private action: ActionEnum = ActionEnum.NEW;
  private mainFormActions: IDataTableAction[] = [];
  private listSectorTypes: IClassificator[] = [];

  protected userData: IUserSector = createUserSector();
  protected sectorTableActions: IDataTableAction[] = [];
  protected sectorTableColumns: IDataTableColumn[] = [];
  protected sectorChoices: ISectorChoice[] = [];
  
  constructor(
    private classificatorService: ClassificatorService,
    private sectorService: SectorFacadeService,
    private alertService: AlertService
    ) { 
      super();
  }

  ngOnInit(): void {
    this.initializeSectorForm();
    this.listSectorTypes = this.classificatorService.get('SECTORS');
  }

  get isUpdateDisabled() {
    return false;
  }

  protected getAction = (formAction: String) => {
    if (formAction == 'REMOVE') {
      return this.mainFormActions[FormActionIndexEnum.DELETE];
    }
    else {
      switch (this.action)
      {
        case ActionEnum.NEW:
          return this.mainFormActions[FormActionIndexEnum.NEW];
        case ActionEnum.EDIT:
        default:
          return this.mainFormActions[FormActionIndexEnum.EDIT];
      }
    }
  }
    
  override initialData(payload: any): void {
    this.action = payload.action;
    this.initializeData(payload.payload as IUserSector);
  }

  private initializeData(userData: IUserSector): void {
    this.userData = userData;
    const sectorChoices: ISectorChoice[] = [];

    this.listSectorTypes.forEach(sector => {
      const fullName = this.getSectorName(sector);
      sectorChoices.push({Id: 0, SectorId: sector.Id, SectorName: fullName, Selected: false, RowState: DataRowOperation.UNCHANGED});
    })

    this.userData.Sectors!.forEach(usec => {
      const seci = sectorChoices.find(item => item.SectorId == usec.SectorId);
      if (seci !== undefined) {
        seci.Id = usec.Id || 0;
        seci.Selected = true;
      }
    })

    this.sectorChoices = sectorChoices;
  }


  private getSectorName(sector: IClassificator): string {
    if (sector.ParentId > 0) {
      let seci = this.listSectorTypes.find(item => item.Id == sector.ParentId);

      if (seci !== undefined) {
        return this.getSectorName(seci) + ' > ' + sector.Name;
      }
    }
    return ' > ' + sector.Name;
  }


  private getSaveBulkData(optionToSave: ISector[]): boolean {

    let hasChanges = false;

    this.sectorChoices.forEach(choice => {
      if (choice.Selected) {
        if (choice.Id == 0) {
          optionToSave.push({
            Id: choice.Id,
            UserId: this.userData.Id,
            SectorId: choice.SectorId,
            RowState: DataRowOperation.INSERT,
          });
          hasChanges = true;
        }
      }
      else {
        if (choice.Id != 0) {
          optionToSave.push({
            Id: choice.Id,
            RowState: DataRowOperation.DELETE
          });
          hasChanges = true;
        }
      }
    })
    return hasChanges;
  }
  
  
  protected doAction(action: IDataTableActionEvent) {

    switch (action.action.action)
    {
      case ActionEnum.EDIT:
      {
        const sectorsToSave: ISector[] = [];
        const hasChanges = this.getSaveBulkData(sectorsToSave);

        if (hasChanges == true) {
          this.sectorService.bulkoperation(sectorsToSave)
            .subscribe({
              next: (result: any[]) => {

                  result.forEach((item: any) => {
                    var fidx = sectorsToSave.findIndex(opt => opt.SectorId == item['SectorId']);

                    if (fidx != -1) {
                      if (sectorsToSave[fidx].RowState == DataRowOperation.DELETE) {

                        var pidx = this.userData.Sectors.findIndex(popt => popt.SectorId == item['SectorId']);

                        if (pidx != -1) {
                          this.userData.Sectors.splice(pidx, 1);
                        }
                      } else if (sectorsToSave[fidx].RowState == DataRowOperation.INSERT) {
                        sectorsToSave[fidx].Id = item['Id'];
                        sectorsToSave[fidx].RowState = DataRowOperation.UNCHANGED;
  
                        this.userData.Sectors.push(sectorsToSave[fidx]);
                      }
                    }
                  });

                  this.formUpdatePayloadByGuid(
                    this.routeBackGuid,
                    this.userData,
                    ActionEnum.EDIT
                    );
                },
              error: (error: any) => { console.error('[ERROR] doAction: error -> %o', error); this.alertService.error('Sectors save error: ' + error);},
              complete: () => { this.action = ActionEnum.EDIT; this.alertService.success('Sectors saved successfully.');}
            }
          );
        }
        break;
      }
    }
  }

  sectorTableAction(event: IDataTableActionEvent) {
  }

  sectorRowAction(event: IDataTableActionEvent) {
    if (event.action.type == DataTableActionType.CHECKCLICK) {
      const sech = event.payload as ISectorChoice;
      sech.Selected = !sech.Selected;
    }
  }


  initializeSectorForm(): void {

    this.mainFormActions = [
      {
        type: DataTableActionType.BUTTON,
        name: "Update",
        action: ActionEnum.NEW,
        icon: ['fas', 'edit'],
      },
      {
        type: DataTableActionType.BUTTON,
        name: "Close",
        action: ActionEnum.EDIT,
        icon: ['fas', 'edit'],
      },
    ];

    this.sectorTableColumns = [
      {
        dataKey: "Selected",
        type: DataTableColumnType.CHECKBOX,
        label: "Selected",
        position: 'left',
        width: "10%"
      },
      {
        dataKey: "SectorName",
        type: DataTableColumnType.TEXT,
        label: "Name",
        position: 'left',
        width: "80%",
      }
    ];
  }

}

