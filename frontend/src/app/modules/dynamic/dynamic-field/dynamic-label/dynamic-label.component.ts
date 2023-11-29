import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-label",
  template: `
  <!--span></span-->
  `,
  styles: []
})
export class DynamicLabelComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;

  constructor() {}
  ngOnInit() {}
}

