import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';

import { DynamicButtonComponent } from './dynamic-field/dynamic-button/dynamic-button.component';
import { DynamicCheckboxComponent } from './dynamic-field/dynamic-checkbox/dynamic-checkbox.component';
import { DynamicClassificatorComponent } from './dynamic-field/dynamic-classificator/dynamic-classificator.component';
import { DynamicDateComponent } from './dynamic-field/dynamic-date/dynamic-date.component';
import { DynamicFieldComponent } from './dynamic-field/dynamic-field.component';
import { DynamicFieldDirective } from './dynamic-field/dynamic-field.directive';
import { DynamicInputComponent } from './dynamic-field/dynamic-input/dynamic-input.component';
import { DynamicRadiobuttonComponent } from './dynamic-field/dynamic-radiobutton/dynamic-radiobutton.component';
import { DynamicRicheditComponent } from './dynamic-field/dynamic-richedit/dynamic-richedit.component';
import { DynamicSelectComponent } from './dynamic-field/dynamic-select/dynamic-select.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

@NgModule({
  declarations: [ 
    DynamicFormComponent,
    DynamicFieldComponent,
    DynamicFieldDirective,
    DynamicButtonComponent,
    DynamicCheckboxComponent,
    DynamicClassificatorComponent,
    DynamicDateComponent,
    DynamicInputComponent,
    DynamicRadiobuttonComponent,
    DynamicRicheditComponent,
    DynamicSelectComponent

  ] ,
  imports: [ 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [ 
    DynamicFormComponent,
    DynamicFieldComponent,
    DynamicFieldDirective,
    DynamicButtonComponent,
    DynamicCheckboxComponent,
    DynamicClassificatorComponent,
    DynamicDateComponent,
    DynamicInputComponent,
    DynamicRadiobuttonComponent,
    DynamicRicheditComponent,
    DynamicSelectComponent
    
   ],
})
export class DynamicModule { }
