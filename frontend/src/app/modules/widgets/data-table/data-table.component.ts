import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IDataTableColumn, DataTableColumnType} from './data-table-column.interface';
import {MatSort, Sort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DataTableActionType, IDataTableAction } from './data-table-action.interface';
import { ActionEnum } from 'src/app/enums/action.enum';


@Component({
  selector: 'widget-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class WidgetDataTableComponent implements OnInit, AfterViewInit {

  protected tableDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  protected displayedColumns: string[] = [];
  protected dataColumns: IDataTableColumn[] = [];

  protected rowClick: IDataTableAction = {
      type: DataTableActionType.ROWCLICK,
      name: "View",
      action: ActionEnum.VIEW,
      icon: ['fas', 'eye'],
    };

  protected checkClick: IDataTableAction = {
      type: DataTableActionType.CHECKCLICK,
      name: "View",
      action: ActionEnum.EDIT,
      icon: ['fas', 'eye'],
    };

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) matSort: MatSort = new MatSort;
  @ViewChild(MatTable) dataTable: MatTable<any> | undefined; 

  @Input() isPageable = true;
  @Input() isSortable = false;
  @Input() isFilterable = false;

  @Input() set tableColumns(columns: IDataTableColumn[]){
    this.dataColumns = columns;
    this.displayedColumns = columns.map((tableColumn: IDataTableColumn) => tableColumn.label);
  }

  @Input() tableActions: IDataTableAction[] = [];
  @Input() rowActionIcon: string = '';
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = this.paginationSizes[1];

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() tableActionEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() rowActionEvent: EventEmitter<any> = new EventEmitter<any>();
  
  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
    console.log('DataTableComponent.tableData1: %o', data);
    this.setTableDataSource(data);
  }

  private filterValues: any = {};
  private lowValue: number = 0;
  private highValue: number = 20;
    
  constructor() {
  }

  ngOnInit(): void {
  }

  // we need this, in order to make pagination work with *ngIf
  ngAfterViewInit(): void {
    this.tableDataSource.sort = this.matSort;

    if (this.isPageable) {
      this.tableDataSource.paginator = this.paginator;
    }

    if (this.isFilterable) {
      // Overrride default filter behaviour of Material Datatable
      this.tableDataSource.filterPredicate = this.createFilter();
    }
  }

  // used to build a slice of papers relevant at any given time
  public getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }

  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.paginator = this.paginator;
    this.tableDataSource.sort = this.matSort;
    if (this.tableDataSource.data.length == 0) {
    }
    
    if (this.isFilterable) {
      // Overrride default filter behaviour of Material Datatable
      this.tableDataSource.filterPredicate = this.createFilter();
    }
  }

  get tableColumnType() { return DataTableColumnType; }

  get tableActionType() { return DataTableActionType; }


  selectionToggle(column: IDataTableColumn, element: any) {
    element[column.dataKey] = !element[column.dataKey];
  }

  isSelected(column: IDataTableColumn, element: any): boolean {
    let value: boolean = false;
    if (column.valueGetter) {
      value = column.valueGetter(column, element) as boolean;
    }
    else {
      value = element[column.dataKey];
    }
    return value;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }


  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    const column = this.tableColumns.find(column => column.label === sortParameters.active);
    if (column != undefined) {
      sortParameters.active = column.dataKey;
      this.sort.emit(sortParameters);
    }
  }

  // Called on Filter change
  filterChange(filter: IDataTableColumn, event: any) {
    this.filterValues[filter.dataKey] = event.target.value.trim().toLowerCase()
    this.tableDataSource.filter = JSON.stringify(this.filterValues)
  }

// Custom filter method fot Angular Material Datatable
createFilter() {
  let filterFunction = function (data: any, filter: string): boolean {
    let searchTerms = JSON.parse(filter);
    let isFilterSet = false;
    for (const col in searchTerms) {
      if (searchTerms[col].toString() !== '') {
        isFilterSet = true;
      } else {
        delete searchTerms[col];
      }
    }

    let nameSearch = () => {
      let found = false;
      if (isFilterSet) {
        for (const col in searchTerms) {
          searchTerms[col].trim().toLowerCase().split(' ').forEach((word: any) => {
            if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
              found = true
            }
          });
        }
        return found
      } else {
        return true;
      }
    }
    return nameSearch()
  }
  return filterFunction
}

public isDisabled = (action: IDataTableAction): boolean => {
  if (ActionEnum.DELETE == action.action)
    return false;

  //return !this.productForm.valid;
  return false;
}

}
