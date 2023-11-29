import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-checkbox",
  template: `
<div class="data-form-item-100 example-form-field custom-field" [formGroup]="group">
<mat-label class="data-form-item-100 example-form-field custom-field">&nbsp;</mat-label>
<mat-checkbox [formControlName]="field.controlName">{{field.label}}</mat-checkbox>
<mat-hint align="end">&nbsp;</mat-hint>
</div>
`,
  styles: []
})
export class DynamicCheckboxComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;

  constructor() {}
  ngOnInit() {}
}
