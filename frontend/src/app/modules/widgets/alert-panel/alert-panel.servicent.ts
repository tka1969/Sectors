import { Injectable } from '@angular/core';
import { Subject, Observable, filter } from 'rxjs';
import { AlertInfo, AlertInfoType } from './alert-panel.model';


@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<AlertInfo>();
    private defaultId = 'default-alert';

    // enable subscribing to alerts observable
    onAlert(id = this.defaultId): Observable<AlertInfo> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    // convenience methods
    success(message: string, options?: any) {
        this.alert(new AlertInfo({ ...options, type: AlertInfoType.Success, message }));
    }

    error(message: string, options?: any) {
        this.alert(new AlertInfo({ ...options, type: AlertInfoType.Error, message }));
    }

    info(message: string, options?: any) {
        this.alert(new AlertInfo({ ...options, type: AlertInfoType.Info, message }));
    }

    warn(message: string, options?: any) {
        this.alert(new AlertInfo({ ...options, type: AlertInfoType.Warning, message }));
    }

    // main alert method    
    alert(alert: AlertInfo) {
        alert.id = alert.id || this.defaultId;
        this.subject.next(alert);
    }

    // clear alerts
    clear(id = this.defaultId) {
        this.subject.next(new AlertInfo({ id }));
    }
}

