import { Component, HostBinding, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { IDynamicFormControl, IDynamicFormValidator } from "../../models/dynamic-layout.interface";

@Component({
  selector: "dynamic-input",
  templateUrl: "./dynamic-input.component.html",
  styleUrls: ["./dynamic-input.component.scss"],  
    host: {
    '[id]': 'id',
  }  
})
export class DynamicInputComponent implements OnInit {
  field!: IDynamicFormControl;
  group!: FormGroup;

  @Input() maxlength: string | number | null;

  static nextId = 0;
  @HostBinding() id = `form-input-${DynamicInputComponent.nextId++}`;
    
  constructor() {
    this.maxlength = null;
  }


  ngOnInit() {
      const validator: IDynamicFormValidator | undefined = this.field.validators?.find(item => item.validator === 'maxLength');
    if (validator !== undefined) {
      this.maxlength = validator.value as number;
    }
  }

  public hasValidator = (validatorName: string) => {
    const validator: IDynamicFormValidator | undefined = this.field.validators?.find(item => item.validator === validatorName);
    return (validator !== undefined)
  }

  public validatorValue = (validatorName: string) => {
    return this.getControlValidatorValue(this.field, validatorName);
  }

  public validatorHint = (validatorName: string, prefix: string, postifix: string) => {
    const validator: IDynamicFormValidator | undefined = this.field.validators?.find(item => item.validator === validatorName);

    if (validator !== undefined) {
      return prefix + validator.value + postifix;
    }
    return "";
  }

  getControlValidatorValue(formControl: IDynamicFormControl, validatorName: string) {
    const control: IDynamicFormControl = formControl; //s.find(item => item.controlName == controlName);
    if (control != null) {
      const validator: IDynamicFormValidator | undefined = control.validators?.find(item => item.validator === validatorName);
      return validator?.value;
    }
    return undefined;
  }

}

