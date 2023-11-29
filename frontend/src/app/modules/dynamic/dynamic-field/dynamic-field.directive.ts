import {
    Directive,
    Input,
    OnInit,
    ViewContainerRef
  } from "@angular/core";
  import { FormGroup } from "@angular/forms";

import { DynamicInputComponent } from "./dynamic-input/dynamic-input.component";
import { DynamicSelectComponent } from "./dynamic-select/dynamic-select.component";
import { DynamicRadiobuttonComponent } from "./dynamic-radiobutton/dynamic-radiobutton.component";
import { DynamicCheckboxComponent } from "./dynamic-checkbox/dynamic-checkbox.component";
import { DynamicButtonComponent } from "./dynamic-button/./dynamic-button.component";
import { DynamicDateComponent } from "./dynamic-date/./dynamic-date.component";
import { IDynamicFormControl } from "../models/dynamic-layout.interface";
import { DynamicRicheditComponent } from "./dynamic-richedit/dynamic-richedit.component";
import { DynamicClassificatorComponent } from "./dynamic-classificator/dynamic-classificator.component";
import { DynamicDividerComponent } from "./dynamic-divider/dynamic-divider.component";
import { DynamicFillerComponent } from "./dynamic-filler/dynamic-filler.component";

interface IDynamicFieldMapper {
    name: string;
    component: any;
};


@Directive({
    selector: "[dynamicField]"
})
export class DynamicFieldDirective implements OnInit {
    
    dynamicComponents: IDynamicFieldMapper[] = [
        {
            name: 'button',
            component: DynamicButtonComponent
        },
        {
            name: 'text',
            component: DynamicInputComponent
        },
        {
            name: 'input',
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
            name: 'radiobutton',
            component: DynamicRadiobuttonComponent
        },
        {
            name: 'date',
            component: DynamicDateComponent
        },
        {
            name: 'checkbox',
            component: DynamicCheckboxComponent
        },
        {
            name: 'richedit',
            component: DynamicRicheditComponent
        },
        {
            name: 'classificator',
            component: DynamicClassificatorComponent
        },
        {
            name: 'divider',
            component: DynamicDividerComponent
        },
        {
            name: 'filler',
            component: DynamicFillerComponent
        }
           
    ]

    @Input() field!: IDynamicFormControl;
    @Input() group!: FormGroup;
    componentRef: any;
    constructor(
      private container: ViewContainerRef
    ) {
    }

    ngOnInit() {
      const componentInstance = this.getComponentByType(this.field.controlType)
      this.componentRef = this.container.createComponent(componentInstance);
      this.componentRef.instance.field = this.field;
      this.componentRef.instance.group = this.group;

      if (this.field.controlType == "divider") {
        this.componentRef.location.nativeElement.classList.add('divider');
        this.componentRef.location.nativeElement.style.marginTop="15px";
      }
      else if (this.field.controlType == "filler") {
        this.componentRef.location.nativeElement.classList.add('filler', 'data-form-item-' + this.field.width);
      } 
      else if (this.field.controlType == "checkbox") {
        this.componentRef.location.nativeElement.classList.add('form-group1', 'data-form-item-20', 'custom-field');
      }
      else {
        if (this.field.width !== undefined) {
            this.componentRef.location.nativeElement.classList.add('form-group1', 'data-form-item-' + this.field.width, 'custom-field');
        }
        else {
            this.componentRef.location.nativeElement.classList.add('form-group1', 'data-form-item-20', 'custom-field');
        }
      }
    }

    getComponentByType(type: string): any {
        return (this.dynamicComponents.find(t => t.name === type) || { component : DynamicInputComponent }).component;
      }
    
  }

