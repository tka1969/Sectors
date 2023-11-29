import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { MaterialModule } from './shared/material.module';

import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { AdminComponent } from './admin/admin/admin.component';
import { InitAppFactory } from './utility/init-app-factory';

import localeEt from '@angular/common/locales/et';
import localeEtExtra from '@angular/common/locales/extra/et';
import { CacheService } from './services/cache.service';

import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { ClassificatorService } from './services/classificator.service';
import { DynamicModule } from './modules/dynamic/dynamic.module';
import { WidgetModule } from './modules/widgets/widget.module';
import { SelectSectorComponent } from './components/select-sector/select-sector.component';
import { UserSectorItemComponent } from './components/user-sector-item/user-sector-item.component';
import { UserSectorListComponent } from './components/user-sector-list/user-sector-list.component';
registerLocaleData(localeEt, 'et-EE', localeEtExtra);

//https://www.npmjs.com/package/ngx-indexed-db
const dbConfig: DBConfig  = {
  name: 'Vikings-1',
  version: 1,
  objectStoresMeta: [{
    store: 'route',
    storeConfig: { keyPath: 'route', autoIncrement: false },
    storeSchema: [
      { name: 'route', keypath: 'route', options: { unique: true } }
    ]
  },
]
};


@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AdminMenuComponent,
    UserSectorListComponent,
    UserSectorItemComponent,
    SelectSectorComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    BrowserAnimationsModule,
    MaterialModule,
    DynamicModule,
    WidgetModule,
    AppRoutingModule,

    NgxIndexedDBModule.forRoot(dbConfig),

    FontAwesomeModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: InitAppFactory,
      deps: [ ClassificatorService, CacheService],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'et-EE'},
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }

}
