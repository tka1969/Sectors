import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-classificator",
  template: `
      <mat-label class="data-form-item-100 example-form-field">Delivery Time</mat-label>
      <mat-form-field class="data-form-item-100 example-form-field" color="accent" appearance="outline" [formGroup]="group">
        <mat-select #id placeholder="Select Delivery Time" [formControlName]="field.controlName" required>
          <mat-option *ngFor="let delivery of field.collection; let i=index" [value]="delivery.PropertyId">{{delivery.Name}}</mat-option>
        </mat-select>
      </mat-form-field>
`,
  styles: []
})
export class DynamicClassificatorComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;
  constructor() {}
  ngOnInit() {}
}

