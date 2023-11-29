import { IDataTableAction } from "./data-table-action.interface";


interface IDataTableValueGetter {
	(column: IDataTableColumn, rowItem: any): string | boolean | number | undefined;
}

interface IDataTableCellAction {
	(column: IDataTableColumn, rowItem: any): string | undefined;
}


export enum DataTableColumnType {
    UNKNOWN = 0,
    ACTION = 1,
    TEXT = 2,
    NUMBER = 3,
    DATE = 4,
    TIME = 5,
    DATETIME = 6,
    BOOLEAN = 7,
    CHECKBOX = 8,
}


export interface IDataTableColumn {
    label: string;
    type: DataTableColumnType;
    dataKey: string;
    width?: string;
    position?: 'right' | 'left';
    isSortable?: boolean;
    isFilter?: boolean;
    cellFormat?: string;
    
    valueGetter?: IDataTableValueGetter;
    cellAction?: IDataTableCellAction;

    actions?: IDataTableAction[];
  }

