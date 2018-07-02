// Angular
import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

// RXJS
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';

// Services
import { WiserOneUtilsService } from '../../utils/wiserone.utils.service';
import { WE_EVENTS } from '../../mocks/events.mock';

// Interfaces
import { ErrorDetails, ERROR_TYPES } from '../../../interfaces/shared/error-banner.interface';

// Const
export const enum REST_EVENTS {
  CONNECTION_ERROR  = 'WISERENERGY.REST.CONNECTION_ERROR',
  REDIRECTION       = 'WISERENERGY.REST.REDIRECTION',
  UNAUTHORIZED_ERROR= 'WISERENERGY.REST.UNAUTHORIZED_ERROR',
  CLIENT_ERROR      = 'WISERENERGY.REST.CLIENT_ERROR',
  SERVER_ERROR      = 'WISERENERGY.REST.SERVER_ERROR',
  UNKNOWN_ERROR     = 'WISERENERGY.REST.UNKNOWN_ERROR'
}

export abstract class MainService {

  dataLoaded$: Observable<any>;
  private _dataLoaded: boolean;
  private _observer: Observer<boolean>;

  constructor(
    protected http                : HttpClient,
    protected wiserOneUtilsService: WiserOneUtilsService,
    protected events              : Events
  ) {
    const self = this;
    this.dataLoaded$ = new Observable<boolean>((observer: Observer<boolean>): void => {
      this._observer = observer;
    }).share();

    if (!this.wiserOneUtilsService.isPluginLoaded()) {
      this.wiserOneUtilsService.wiserOnePluginLoaded$.subscribe((loaded: boolean): void => {
        self.fetchData();
      });
    }
  }

  /****************************************************************************
   * Public functions
   ***************************************************************************/

  public abstract fetchData(): void;

  public isDataLoaded(): boolean {
    return this._dataLoaded;
  }

  public dataLoaded(loaded: boolean = true): void {
    if (!this._observer) { return; }
    this._dataLoaded = loaded;
    this._observer.next(loaded);
  }

  /****************************************************************************
   * Protected functions
   ***************************************************************************/

  protected fetchServiceData(services: MainService[]): void {
    if (this.wiserOneUtilsService.isPluginLoaded()) {
      for (const service of services) {
        service.fetchData();
      }
    }
  }

  protected httpGET(url: string, options?: any): Promise<Object> {
    return this.performHttpRequest(
      this.http.get(url, options)
    );
  }

  protected httpPOST(url: string, options?: any, payload?: any): Promise<Object> {
    return this.performHttpRequest(
      this.http.post(url, payload, options)
    );
  }

  protected httpPUT(url: string, options?: any, payload?: any): Promise<Object> {
    return this.performHttpRequest(
      this.http.put(url, payload, options)
    );
  }

  protected httpDELETE(url: string, options?: any, payload?: any): Promise<Object> {
    return this.performHttpRequest(
      this.http.delete(url, options)
    );
  }

  /****************************************************************************
   * Private functions
   ***************************************************************************/

  private getServiceClassName(): string {
    const classInfos = this.constructor.toString().match(/\w+/g);
    return (classInfos && classInfos.length >= 2) ? classInfos[1] : null;
  }

  private performHttpRequest(request: Observable<any>): Promise<any> {
    return request
    .toPromise()
    .catch((response: any) => {
      // An error occured, display the error banner with error object
      this.events.publish(
        WE_EVENTS.EMITTER.ERROR_BANNER.DISPLAY,
        this.buildErrorObject(response)
      );
    });
  }

  private buildErrorObject(response: any): ErrorDetails {
    let type: ERROR_TYPES;
    let event: REST_EVENTS;

    const code = response.status;
    if (code === -1 || code === 0) {
      event = REST_EVENTS.CONNECTION_ERROR;
      type = ERROR_TYPES.DANGER;
    } else if (code >= 300 && code < 400) {
      event = REST_EVENTS.REDIRECTION;
    } else if (code === 401) {
      event = REST_EVENTS.UNAUTHORIZED_ERROR;
      type = ERROR_TYPES.DANGER;
    } else if (code === 400 || code > 401 && code < 500) {
      event = REST_EVENTS.CLIENT_ERROR;
    } else if (code >= 500 && code < 600) {
      event = REST_EVENTS.SERVER_ERROR;
      type = ERROR_TYPES.DANGER;
    } else {
      event = REST_EVENTS.UNKNOWN_ERROR;
      type = ERROR_TYPES.WARNING;
    }

    return {
      class  : this.getServiceClassName(),
      status : response.status,
      event  : event,
      name   : response.name,
      message: response.message,
      type   : type
    };
  }
}
