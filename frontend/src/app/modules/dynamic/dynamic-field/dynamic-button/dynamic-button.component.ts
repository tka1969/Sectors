import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-button",
  template: `
<div class="demo-full-width margin-top" [formGroup]="group">
<button type="submit" mat-raised-button color="primary">{{field.label}}</button>
</div>
`,
  styles: []
})
export class DynamicButtonComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;

  constructor() {}
  ngOnInit() {}
}
