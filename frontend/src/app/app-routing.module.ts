import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin/admin/admin.component';
import { SelectSectorComponent } from './components/select-sector/select-sector.component';
import { UserSectorItemComponent } from './components/user-sector-item/user-sector-item.component';
import { UserSectorListComponent } from './components/user-sector-list/user-sector-list.component';


const routes: Routes = [

  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'user-sector-list',
    component: UserSectorListComponent
  },
  {
    path: 'user-sector-item/:guid',
    component: UserSectorItemComponent
  },
  {
    path: 'select-sector/:guid',
    component: SelectSectorComponent
  },

  { path: '', pathMatch: 'full', redirectTo: '/' },
  { path: '**', pathMatch: 'full', redirectTo: '/' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
