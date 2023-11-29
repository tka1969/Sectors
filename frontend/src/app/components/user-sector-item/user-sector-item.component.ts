import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from 'src/app/base/base/base.component';
import { ActionEnum, FormActionIndexEnum } from 'src/app/enums/action.enum';
import { ALL_USERSECTOR_FIELDS, IUserSector, createUserSector } from 'src/app/models/user-sector.interface';
import { UserSectorFacadeService } from 'src/app/services/user-sector-facade.service';
import { IDynamicForm, DynamicFormControlType } from 'src/app/modules/dynamic/models/dynamic-layout.interface';
import { AlertService } from 'src/app/modules/widgets/alert-panel/alert-panel.servicent';
import { IDataTableActionEvent } from 'src/app/modules/widgets/data-table/data-table-action-event.interface';
import { IDataTableAction, DataTableActionType } from 'src/app/modules/widgets/data-table/data-table-action.interface';
import { DataTableColumnType, IDataTableColumn } from 'src/app/modules/widgets/data-table/data-table-column.interface';
import { DynamicFormComponent } from 'src/app/modules/dynamic/dynamic-form/dynamic-form.component';
import { ISector } from 'src/app/models/sector.interface';
import { IClassificator, createClassificator } from 'src/app/models/classificator.interface';
import { ClassificatorService } from 'src/app/services/classificator.service';
import { SectorFacadeService } from 'src/app/services/sector-facade.service';
import { QueryModel, createQueryModel } from 'src/app/models/query.model';
import { MessageBoxButtons, MessageBoxResult, MessageBoxService } from 'src/app/modules/widgets/widget.module';

@Component({
  selector: 'app-user-sector-item',
  templateUrl: './user-sector-item.component.html',
  styleUrls: ['./user-sector-item.component.scss']
})
export class UserSectorItemComponent extends BaseComponent {

  private action: ActionEnum = ActionEnum.NEW;
  private mainFormActions: IDataTableAction[] = [];
  private listSectorTypes: IClassificator[] = [];
  protected listSectors: ISector[] = [];

  protected userData: IUserSector = createUserSector();
  protected sectorTableActions: IDataTableAction[] = [];
  protected sectorTableColumns: IDataTableColumn[] = [];
  
  @ViewChild(DynamicFormComponent) formView!: DynamicFormComponent;
  
  protected dynamicForm: IDynamicForm = {
    formName: "USER SECTORS",
    formGroups: [
      {
        controls: [
          {
            controlType: DynamicFormControlType.CHECKBOX,
            controlName: "termsagreed",
            modelName: "IsTermsAgreed",
            label: "Terms Agreed",
            width: 20,
          },
          {
            controlType: DynamicFormControlType.INPUT,
            controlName: "username",
            modelName: "Username",
            label: "Username",
            placeholder: "Username",
            width: 40,
            validators: [
              {
                validator:"required",
                message: "required data"
              },
              {
                validator: "maxLength",
                value: 25,
                message: "max length is 25"
              }
            ]
          }
        ]
      }
    ]
  };


  constructor(
    private classificatorService: ClassificatorService,
    private userService: UserSectorFacadeService,
    private sectorService: SectorFacadeService,
    private messageBox: MessageBoxService,
    private alertService: AlertService
    ) { 
      super();
  }


  protected ngOnInit(): void {
    this.initializeUserSectorItemForm();
    this.listSectorTypes = this.classificatorService.get('SECTORS');
  }

  get sectors() {
    return this.listSectors;
  }

  get service() {
    return this.sectorService;
  }

  get isDisabled() {
    if (ActionEnum.NEW == this.action)
      return true;

    return false;
  }

  get isUpdateDisabled() {
    return false;
  }

  get isNew() {
    return (ActionEnum.NEW == this.action);
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

  public initializeData(userData: IUserSector): void {
    this.userData = userData;
    this.listSectors = userData.Sectors;
    if (userData.Sectors == undefined) {
      const queryp: QueryModel = createQueryModel({Parameters: {UserId: userData.Id}});
      this.sectorService.query(queryp, false, (data: ISector[]): void => { const self=this; this.onSectorListComplete(data); });
    }
  }

  private onSectorListComplete(sectors: ISector[]): void {
    this.userData.Sectors = sectors;
    this.listSectors = sectors;
  }


  protected doAction(action: IDataTableActionEvent) {

    switch (action.action.action)
    {
      case ActionEnum.NEW:
      case ActionEnum.EDIT:
      {
        if (!this.formView.isDataValid()) {
          this.messageBox.show("Andmete Sisestamine", "Sisesta kõik vajalikud andmed?", MessageBoxButtons.ok);
          break;
        }

        const userToSave: any = (action.action.action == ActionEnum.NEW) ? createUserSector() : {}; //{Id: this.userData.Id, Sectors: this.userData.Sectors};
        const hasChanges = this.formView.getFormChanges(action.action.action == ActionEnum.NEW, this.userData, userToSave);

        if (hasChanges == true) {
          userToSave.Id = this.userData.Id;
          this.sectorService.setLoading();
          this.userService.update(userToSave)
            .subscribe({
              next: (result: IUserSector) => {
                  if (action.action.action == ActionEnum.NEW) {
                    this.userData = result;
                  }
                  else {
                    this.applyToModel(ALL_USERSECTOR_FIELDS, result, this.userData);
                  }
                  this.formView.patchFormData(this.userData);
                  this.sectorService.setLoaded();
                },
              error: (error: any) => { console.error('[ERROR] doAction: error -> %o', error); this.alertService.error('User sector save error: ' + error); this.sectorService.setError(error); },
              complete: () => { this.action = ActionEnum.EDIT; this.alertService.success('User sector saved successfully.'); this.sectorService.setLoaded(); }
            }
          );          
        }
        break;
      }

      case ActionEnum.DELETE:
        if (this.userData.Id !== undefined) {
          this.messageBox.show("Andmete Kustutamine", "Oled kindel, et soovid kustutada?", MessageBoxButtons.yesNo, (result) => {
            if (result == MessageBoxResult.yes) {
              this.userService.delete(this.userData.Id as number);
              this.closeForm();
            }
          });
        }
        break;
    }
  }

  protected openSelectSectorsForm(event: IDataTableActionEvent, usec: IUserSector) {
    if (event.action.action == ActionEnum.EDIT) {

      this.formNavigate(
        "UserSectorItemComponent",
        "/select-sector",
        "/user-sector-item",
        { 
          action: event.action.action,
          payload: usec
        });
    }
  }

  protected sectorTableAction(event: IDataTableActionEvent) {
    this.openSelectSectorsForm(event, this.userData);
  }

  protected sectorRowAction(event: IDataTableActionEvent) {
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


  private initializeUserSectorItemForm(): void {

    this.mainFormActions = [
      {
        type: DataTableActionType.BUTTON,
        name: "Update...",
        action: ActionEnum.EDIT,
        icon: ['fas', 'edit'],
      },
      {
        type: DataTableActionType.BUTTON,
        name: "Close",
        action: ActionEnum.EDIT,
        icon: ['fas', 'edit'],
      },
      {
        type: DataTableActionType.BUTTON,
        name: "Remove...",
        action: ActionEnum.DELETE,
        icon: ['fas', 'edit'],
      },
    ];

    this.sectorTableActions = [
      {
        type: DataTableActionType.BUTTON,
        name: "Select Sectors...",
        action: ActionEnum.EDIT,
        icon: ['fas', 'eye'],
      },
    ];

    this.sectorTableColumns = [
      {
        dataKey: "SectorId",
        type: DataTableColumnType.TEXT,
        label: "Sector",
        position: 'left',
        width: "100%",
        valueGetter: (column: IDataTableColumn, rowItem: ISector): string | undefined => { return this.getSectorName(this.listSectorTypes.find(item => item.Id == rowItem.SectorId) || createClassificator()); },
      },
    ];
  }

}
