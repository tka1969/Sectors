import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-divider",
  template: `
  <!--span></span-->
  `,
  styles: []
})
export class DynamicDividerComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;

  constructor() {}
  ngOnInit() {}
}
