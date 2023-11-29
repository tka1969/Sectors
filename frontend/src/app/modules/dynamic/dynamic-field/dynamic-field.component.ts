import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { FormGroup, FormGroupDirective } from "@angular/forms";
import { DynamicInputComponent } from "./dynamic-input/dynamic-input.component";
import { DynamicSelectComponent } from "./dynamic-select/dynamic-select.component";
import { DynamicRadiobuttonComponent } from "./dynamic-radiobutton/dynamic-radiobutton.component";
import { DynamicCheckboxComponent } from "./dynamic-checkbox/dynamic-checkbox.component";
import { DynamicDividerComponent } from "./dynamic-divider/dynamic-divider.component";
import { DynamicFillerComponent } from "./dynamic-filler/dynamic-filler.component";

@Component({
  selector: "dynamic-field-input",
  templateUrl: "./dynamic-field.component.html",
  styleUrls: ["./dynamic-field.component.scss"],
})
export class DynamicFieldComponent implements AfterViewInit {

  supportedDynamicComponents = [
    {
      name: 'text',
      component: DynamicInputComponent
    },
    {
      name: 'number',
      component: DynamicInputComponent
    },
    {
      name: 'select',
      component: DynamicSelectComponent
    },
    {
      name: 'radio',
      component: DynamicRadiobuttonComponent
    },
    {
      name: 'date',
      component: DynamicInputComponent
    },
    {
      name: 'checkbox',
      component: DynamicCheckboxComponent
    },
    {
      name: 'divider',
      component: DynamicDividerComponent
    },
    {
      name: 'filler',
      component: DynamicFillerComponent
    },

  ]
  @ViewChild('dynamicInputContainer', { read: ViewContainerRef }) dynamicInputContainer!: ViewContainerRef;
  @Input() field: any;
  formName!: FormGroup;

  constructor(private formgroupDirective: FormGroupDirective, private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.registerDynamicField();
  }

  private registerDynamicField() {
    this.dynamicInputContainer.clear();
    const componentInstance = this.getComponentByType(this.field.type)
    const dynamicComponent = this.dynamicInputContainer.createComponent(componentInstance)
    dynamicComponent.setInput('field', this.field);
    this.cd.detectChanges();
  }

  getComponentByType(type: string): any {
    return (this.supportedDynamicComponents.find(t => t.name === type) || { component : DynamicInputComponent }).component;
  }

}
