import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from './alert-panel.servicent';
import { AlertInfo, AlertInfoType } from './alert-panel.model';

@Component({
  selector: 'alert-panel',
  templateUrl: './alert-panel.component.html',
  styleUrls: ['./alert-panel.component.scss']
})
export class AlertPanelComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;
  @Input() singleMode = true;

  alerts: AlertInfo[] = [];
  alertSubscription!: Subscription;
  routeSubscription!: Subscription;

  constructor(private router: Router, private alertService: AlertService) { }

  ngOnInit() {
      // subscribe to new alert notifications
      this.alertSubscription = this.alertService.onAlert(this.id)
          .subscribe(alert => {
              // clear alerts when an empty alert is received
              if (!alert.message) {
                  // filter out alerts without 'keepAfterRouteChange' flag
                  this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

                  // remove 'keepAfterRouteChange' flag on the rest
                  this.alerts.forEach(x => delete x.keepAfterRouteChange);
                  return;
              }

              if (this.singleMode) {
                this.alerts = [];
              }

              // add alert to array
              this.alerts.push(alert);

              // auto close alert if required
              if (alert.autoClose) {
                  setTimeout(() => this.removeAlert(alert), 3000);
              }
         });

      // clear alerts on location change
      this.routeSubscription = this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
              this.alertService.clear(this.id);
          }
      });
  }

  ngOnDestroy() {
      // unsubscribe to avoid memory leaks
      this.alertSubscription.unsubscribe();
      this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: AlertInfo) {
      // check if already removed to prevent error on auto close
      if (!this.alerts.includes(alert)) return;

      if (this.fade) {
          // fade out alert
          const alert1: AlertInfo | undefined = this.alerts.find(x => x === alert);

          if (alert1 !== undefined) {
            alert1.fade = true
          }

          // remove alert after faded out
          setTimeout(() => {
              this.alerts = this.alerts.filter(x => x !== alert);
          }, 250);
      } else {
          // remove alert
          this.alerts = this.alerts.filter(x => x !== alert);
      }
  }

  cssClass(alert: AlertInfo) {
      if (!alert) return;

      const classes = ['alert', 'alert-dismissable', 'alert-panel'];
              
      const alertTypeClass = {
          [AlertInfoType.Success]: 'alert-success',
          [AlertInfoType.Error]: 'alert-danger',
          [AlertInfoType.Info]: 'alert-info',
          [AlertInfoType.Warning]: 'alert-warning'
      }

      classes.push(alertTypeClass[alert.type]);

      if (alert.fade) {
          classes.push('fade');
      }

      return classes.join(' ');
  }
}

