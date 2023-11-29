    
export interface IDynamicFormValidator {
    validator: string;
    value?: string | number | RegExp;
    message?: string;
};
          
export enum DynamicFormControlType {
    INPUT = 'input',
    NUMBER = 'number',
    BUTTON = 'button',
    SELECT = 'select',
    CLASSIFICATOR = 'classificator',
    DATE = 'date',
    DATEPICKER = 'datepicker',
    RADIOBUTTON = 'radiobutton',
    CHECKBOX = 'checkbox',
    EDITOR = 'editor',
    RICHEDIT = 'richedit',
    DIVIDER = 'divider',
    LABEL = 'label',
    FILLER = 'filler'
};

// Model -> FormControl
interface IDynamicFormValueGetter {
  (model: any): string | undefined;
}

// FormControl -> Model
interface IDynamicFormValueSetter {
  (model: any, value: any): void;
}


export interface IDynamicFormControl {
    controlName: string;
    controlType: DynamicFormControlType;

    label?: string;
    placeholder?: string;

    disabled?: boolean;
    readonly?: boolean;

    value?: any;
    //value: T | undefined;
    options?: { key: string, value: string }[];
  
    modelName: string;
    valueGetter?: IDynamicFormValueGetter;
    valueSetter?: IDynamicFormValueSetter;
    validators?: IDynamicFormValidator[];

    width?: number;

    richEditoConfig?: any;
    collection?: any;
};

export interface IDynamicFormGroup {
    groupName?: string;
    controls: IDynamicFormControl[];
};

export interface IDynamicForm {
    formName?: string;
    maxColumns?: number;
    formGroups: IDynamicFormGroup[];
};
