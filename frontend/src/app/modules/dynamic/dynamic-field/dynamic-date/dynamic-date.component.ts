import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-date",
  template: `
<mat-label class="data-form-item-100 example-form-field custom-field">{{field.label!}}</mat-label>
<mat-form-field class="data-form-item-100 example-form-field custom-field" [formGroup]="group" color="accent" floatLabel="auto" appearance="outline" >
  <!--input matInput #id [owlDateTime]="picker" class="custom-field" [formControlName]="field.controlName" readonly="readonly" placeholder="{{field.placeholder!}}">
  <mat-icon matSuffix style="height:16px; width:16px;" fontSet="fa" fontIcon="fa-calendar" color="primary" [owlDateTimeTrigger]="picker"></mat-icon>
  <owl-date-time #picker></owl-date-time-->
</mat-form-field>
`,
  styles: []
})
export class DynamicDateComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;

  constructor() {}
  ngOnInit() {}
}

