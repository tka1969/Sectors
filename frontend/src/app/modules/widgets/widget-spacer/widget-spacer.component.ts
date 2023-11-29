import { Component, Input } from '@angular/core';

@Component({
  selector: 'widget-spacer',
  //templateUrl: './widget-spacer.component.html',
  styleUrls: ['./widget-spacer.component.scss'],
  template: `
    <div [ngClass]="{ 'widget-spacer': true }" [style.height]=height ></div>
  `,
  styles: ['widget-spacer { display: block; width: 100%; margin: 5px 0; }'],  
})
export class WidgetSpacerComponent {

  private _height: string = "10px";

  @Input() get height(): string { return this._height; }
  set height(height: string) { this._height = height; }
}
