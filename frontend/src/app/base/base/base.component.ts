import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { ActionEnum } from 'src/app/enums/action.enum';
import { IFormRouteInfo } from 'src/app/models/form-route-info.interface';
import { Guid, GUID } from 'src/app/utility/guid';


export interface IFormPayloadInfo {
    action: ActionEnum;
	  level: number;
    index: number;
	  payload?: any;
  }


export class BaseComponent {

  router: Router = inject(Router);
  activatedroute: ActivatedRoute = inject(ActivatedRoute);
  dbService: NgxIndexedDBService = inject(NgxIndexedDBService);

  guid: GUID;
  level: number = -1;
  route: string = "";
  routeBack: string = "";
  routeBackGuid: GUID = Guid.createEmpty().toGUID();

  constructor(
    ) {
      this.guid = this.activatedroute.snapshot.paramMap.get("guid") as GUID;
      this.route = this.router.url;

      if (this.guid !== null) {
        this.setLoading(true);

        this.dbService.getByID('route', this.guid).subscribe((result) => {

            if (result != undefined && result != null) {
              const route: IFormRouteInfo = result as IFormRouteInfo;

              this.level = route.level;
              this.routeBack = route.routeBack;
              this.routeBackGuid = route.routeBackId;
              this.initialData((result as any).payload);
            }
            this.setLoading(false);
          });
      }
  }

  initialData(payload: any): void {
  }

  loadData(refresh: boolean): void {
  }

  refresh(): void { 
    this.loadData(true);
  }  
  
  retry(): void { 
    this.loadData(false);
  }
  
  setLoaded(loaded: boolean) {
  }

  setLoading(loading: boolean) {
  }

  formUpdatePayloadByGuid(guid: GUID, payload: any, action: ActionEnum = ActionEnum.UNDEFINED, closeForm: boolean = false) {
    this.setLoading(true);
    this.dbService.getByID('route', guid).subscribe((result) => {
      if (result != undefined && result != null) {

        const route: IFormRouteInfo = result as IFormRouteInfo;
        const formpl: IFormPayloadInfo = route.payload;

        formpl.payload = payload;

        if (action !== ActionEnum.UNDEFINED) {
          formpl.action = action;  
        }
        route.payload = formpl;

        this.dbService.update('route', route)
          .subscribe((result) => {
            this.setLoading(false);
  
            if (closeForm) {
              this.closeForm();
            }
          });        
      }
    });
    //this.setLoading(false);
  }


  formNavigate(initiator: string, routeTo: string, routeBack: string, payload: any) {
    
    const guid: GUID = Guid.createGUID();

    const route: IFormRouteInfo = {
      initiator: initiator,
      route: guid,
      routeBack: routeBack,
      routeBackId: this.guid,
      level: this.level + 1,
      payload: payload
    };
  
    this.setLoading(true);
    this.dbService.add('route', route)
      .subscribe((result) => {
        this.router.navigate([routeTo, guid]);
        this.setLoading(false);
    });
  }

  closeForm() {
    this.dbService.deleteByKey('route', this.guid).subscribe((result) => {
    });

    if (this.routeBackGuid == null) {
      this.router.navigate([this.routeBack]);
    }
    else {
      this.router.navigate([this.routeBack, this.routeBackGuid]);
    }
  }

  public enumAction(action: string): ActionEnum {
    switch (action)
    {
        case 'NEW':
          return ActionEnum.NEW;
        case 'VIEW':
          return ActionEnum.VIEW;
        case 'EDIT':
          return ActionEnum.EDIT;
        case 'DELETE':
          return ActionEnum.DELETE;
    }
    return ActionEnum.NEW;
  }

  public actionToText(action: ActionEnum): string {
    switch (action)
    {
        case ActionEnum.NEW:
          return 'New';
        case ActionEnum.VIEW:
          return 'View';
        case ActionEnum.EDIT:
          return 'Edit';
        case ActionEnum.DELETE:
          return 'Delete';
    }
    return 'New';
  }  


  public applyToModel(validFields: string[], modelIn: any, modelOut: any): void {
    
    validFields.forEach((field: string) => {
      if (modelIn[field] !== undefined) {
        modelOut[field] = modelIn[field];
      }
    });
  }
}

