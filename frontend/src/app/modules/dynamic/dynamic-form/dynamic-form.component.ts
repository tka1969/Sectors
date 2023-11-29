import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import {
  FormControl, FormGroup, Validators,
  FormBuilder,
} from "@angular/forms";
import { DynamicFormControlType, IDynamicForm, IDynamicFormControl, IDynamicFormGroup, IDynamicFormValidator } from "../models/dynamic-layout.interface";



@Component({
  selector: "dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
})
export class DynamicFormComponent implements OnInit {
  @Input() dynamicForm!: IDynamicForm;
  @Input() set formData(data: any) {
    this.patchFormData(data);
  }

  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  
  mainForm!: FormGroup;

  get value() {
    return this.mainForm.value;
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.mainForm = this.createFormGroup();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.mainForm.valid) {
      this.submit.emit(this.mainForm.value);
    } else {
      this.validateAllFormFields(this.mainForm);
    }
  }

  createFormGroup(): FormGroup {
    const formGroup = this.fb.group({});
    this.dynamicForm.formGroups.forEach(group => {
      group.controls.forEach(field => {
        if (field.controlType === "button") return;
        if (field.controlType === "divider") return;
        if (field.controlType === "filler") return;

        let itemValue = field.value;
        
        if (this.formData !== undefined) {
          if (this.formData[field.modelName] != undefined) {
            if (field.controlType === DynamicFormControlType.DATEPICKER && typeof this.formData[field.modelName] === 'string') {
              itemValue = new Date(this.formData[field.modelName]);
            }
            else {
              itemValue = (field.valueGetter)
                              ? field.valueGetter(this.formData)
                              : this.formData[field.modelName];
            }
          }
        }
        const validators: any = this.bindValidations(field.validators);
        const control = new FormControl(itemValue, validators);

        formGroup.addControl(field.controlName, control);
      });
    });
    return formGroup;
  }

  private bindValidations(rules?: IDynamicFormValidator[]) {
    if (!rules) {
      return [];
    }

    const validList: any[] = [];
    const validators = rules.forEach((rule: IDynamicFormValidator) => {

      switch (rule.validator) {
        case "required":
          validList.push(Validators.required);
          return Validators.required;

        case "min":
          validList.push(Validators.min(rule.value as number));
          return Validators.min(rule.value as number);
        case "max":
          validList.push(Validators.max(rule.value as number));
          return Validators.max(rule.value as number);
        case "minLength":
          validList.push(Validators.minLength(rule.value as number));
          return Validators.minLength(rule.value as number);
        case "maxLength":
          validList.push(Validators.maxLength(rule.value as number));
          return Validators.maxLength(rule.value as number);

        //add more case for future.

          default:
            return null;
      }
    });
    return Validators.compose(validList);
  }
  
  isDataValid(): boolean {
    if (!this.mainForm.valid) {
      this.validateAllFormFields(this.mainForm);
    }
    return (this.mainForm.valid);
  }
  
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }


  public patchFormData(modelIn: any) {

    if (this.mainForm !== undefined) {
      const modelForm: any = {};

      this.dynamicForm.formGroups.forEach((dynGroup: IDynamicFormGroup) => {
        dynGroup.controls.forEach((field: IDynamicFormControl) => {

          if (field.controlType === "button") return;
          if (field.controlType === "divider") return;
          if (field.controlType === "filler") return;
  
          if (modelIn[field.modelName] != undefined && this.mainForm.controls[field.controlName] != undefined) {
            if (field.controlType === DynamicFormControlType.DATEPICKER && typeof modelIn[field.modelName] === 'string') {
              modelForm[field.controlName] = new Date(modelIn[field.modelName]);
            }
            else {
              const value = (field.valueGetter)
                              ? field.valueGetter(modelIn)
                              : modelIn[field.modelName];

              modelForm[field.controlName] = value;
            }
          }
        });
      });

      this.mainForm.patchValue(modelForm);
    }
  }

  public getFormChanges(creatingNew: boolean, modelIn: any, modelOut: any): boolean {
    let hasChanges = false;
    const form = this.mainForm.value;

    this.dynamicForm.formGroups.forEach((dynGroup: IDynamicFormGroup) => {
      dynGroup.controls.forEach((field: IDynamicFormControl) => {

        if (field.controlType === "button") return;
        if (field.controlType === "divider") return;
        if (field.controlType === "filler") return;

        if (form[field.controlName] != undefined) {
          const valueNew = form[field.controlName];
          const value = (field.valueGetter)
                          ? field.valueGetter(modelIn)
                          : modelIn[field.modelName];

          if (creatingNew || valueNew != value) {

            if (field.valueSetter) {
              field.valueSetter(modelOut, valueNew);
            }
            else {
              modelOut[field.modelName] = valueNew;
            }
            hasChanges = true;
          }
        }
      });
    });
    return hasChanges;
  }

}

