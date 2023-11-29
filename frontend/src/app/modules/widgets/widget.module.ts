import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertPanelComponent } from './alert-panel/alert-panel.component';
import { WidgetDataTableComponent } from './data-table/data-table.component';
import { ErrorPanelComponent } from './error-panel/error-panel.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { WidgetDividerComponent } from './widget-divider/widget-divider.component';
import { WidgetSpacerComponent } from './widget-spacer/widget-spacer.component';
import { DataHighlightPipe } from './data-table/data-highlight.pipe';
import { DataPropertyGetterPipe } from './data-table/data-property-getter.pipe';
import { MaterialModule } from 'src/app/shared/material.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { MessageBoxComponent } from './message-box/message-box.component';

export * from './message-box/message-box-buttons.enum';
export * from './message-box/message-box-result.enum';
export * from './message-box/message-box.service';

@NgModule({
  declarations: [ 
      WidgetDataTableComponent,
      DataPropertyGetterPipe,
      DataHighlightPipe,
      ErrorPanelComponent,
      InfoPanelComponent,
      AlertPanelComponent,
      WidgetSpacerComponent,
      WidgetDividerComponent,
      MessageBoxComponent
    ],
  imports: [
    CommonModule,
    MaterialModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [ 
      WidgetDataTableComponent,
      DataPropertyGetterPipe,
      DataHighlightPipe,
      ErrorPanelComponent,
      InfoPanelComponent,
      AlertPanelComponent,
      WidgetSpacerComponent,
      WidgetDividerComponent,
      MessageBoxComponent
   ],
})
export class WidgetModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
 }
