import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ActionEnum } from "src/app/enums/action.enum";


export enum DataTableActionType {
  ICON = 1,
  BUTTON = 2,
  LINK = 3,
  ROWCLICK = 4,
  CHECKCLICK = 5
}

export enum DataTableActionText {
  STATIC = 1,
  LABEL = 2,
}

export interface IDataTableAction {
    type: DataTableActionType,
    label?: string;
    name: string;
    action: ActionEnum;
    actiontext?: DataTableActionText,
    icon: IconProp;
  }

