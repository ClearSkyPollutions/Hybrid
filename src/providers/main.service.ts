// Angular
import { Events } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

// RXJS
import { Observable } from 'rxjs/Observable';
import { ErrorDetails, ERROR_TYPES } from '../models/shared/error-banner.interface';

// Const
export const enum REST_EVENTS {
  CONNECTION_ERROR  = 'CLEARSKY.REST.CONNECTION_ERROR',
  REDIRECTION       = 'CLEARSKY.REST.REDIRECTION',
  UNAUTHORIZED_ERROR= 'CLEARSKY.REST.UNAUTHORIZED_ERROR',
  CLIENT_ERROR      = 'CLEARSKY.REST.CLIENT_ERROR',
  SERVER_ERROR      = 'CLEARSKY.REST.SERVER_ERROR',
  UNKNOWN_ERROR     = 'CLEARSKY.REST.UNKNOWN_ERROR'
}


export abstract class MainService {

  constructor(
    protected http  : HttpClient,
    protected events: Events
  ) {
  }

    /****************************************************************************
   * Protected functions
   ***************************************************************************/

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
    .catch((error: any) => {
      console.error('ERR SERVICE', error);
      // An error occured, display the error banner with error object
      this.events.publish(
        'CLEAR_SKY:Error',
        this.buildErrorObject(error)
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
