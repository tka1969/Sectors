import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-filler",
  template: `
  <!--span></span-->
  `,
  styles: []
})
export class DynamicFillerComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;

  constructor() {}
  ngOnInit() {}
}
