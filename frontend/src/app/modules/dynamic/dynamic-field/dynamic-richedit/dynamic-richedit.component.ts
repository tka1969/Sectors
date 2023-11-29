import { Component, HostBinding, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl, IDynamicFormValidator } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-richedit",
  templateUrl: "./dynamic-richedit.component.html",
  styleUrls: ["./dynamic-richedit.component.scss"],  
  host: {
    '[id]': 'id',
  }  
})
export class DynamicRicheditComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;
  fieldHeight: number = 250;

  static nextId = 0;
  @HostBinding() id = `form-richedit-${DynamicRicheditComponent.nextId++}`;
    
  constructor() {

  }
  ngOnInit() {
  }

  getFieldStyle() {
    return "height: " + this.fieldHeight + "px;";
  }

}


