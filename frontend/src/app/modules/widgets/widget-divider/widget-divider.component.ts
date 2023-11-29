import { Component, Input } from '@angular/core';

@Component({
  selector: 'widget-divider',
  //templateUrl: './widget-divider.component.html',
  styleUrls: ['./widget-divider.component.scss'],
  template: `
    <div [ngClass]="{ 'widget-divider': true }" ></div>
  `,
  styles: ['widget-divider { display: block; height: 1px; width: 100%; margin: 5px 0; background: #48484830; }'],    
})
export class WidgetDividerComponent {
}
