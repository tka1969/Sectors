import { IDataTableAction } from "./data-table-action.interface";

export interface IDataTableActionEvent {
    action: IDataTableAction;
    payload?: any;
  }


