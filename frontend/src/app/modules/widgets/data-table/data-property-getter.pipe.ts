import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { IDataTableColumn, DataTableColumnType } from './data-table-column.interface';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'dataPropertyGetter'
})
export class DataPropertyGetterPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) public locale: string, public datepipe: DatePipe) {}

  transform(object: any, column: IDataTableColumn, ...args: any[]): any {

    if (column.valueGetter) {
      return column.valueGetter(column, object);
    }

    const locale1 = Intl.DateTimeFormat().resolvedOptions().locale;

    switch (column.type) {
      case DataTableColumnType.DATETIME:
        //return this.datepipe.transform(object[column.dataKey], 'dd.MM.yyyy HH:mm:ss', this.locale);
        return this.datepipe.transform(object[column.dataKey], column.cellFormat ?? 'dd.MM.yyyy HH:mm:ss', locale1); //this.locale);
      case DataTableColumnType.DATE:
        return this.datepipe.transform(object[column.dataKey], column.cellFormat ?? 'dd.MM.yyyy', locale1); //this.locale);
      case DataTableColumnType.TIME:
        return this.datepipe.transform(object[column.dataKey], column.cellFormat ?? 'HH:mm:ss', locale1); //this.locale);
    }
    return object[column.dataKey];
  }

}

