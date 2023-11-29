import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-select",
  template: `
<mat-form-field class="demo-full-width margin-top" [formGroup]="group">
<mat-select [placeholder]="field.label!" [formControlName]="field.controlName">
<mat-option *ngFor="let item of field.options" [value]="item">{{item}}</mat-option>
</mat-select>
</mat-form-field>
`,
  styles: []
})
export class DynamicSelectComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;
  constructor() {}
  ngOnInit() {}
}

