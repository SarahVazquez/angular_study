import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@_core/services';
import { environment } from '@_environments/environment';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
    ShowConsoleMessages:boolean = environment.showConsoleMessages;

    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
                .pipe(
                    catchError(error => {
        
                        if(this.ShowConsoleMessages){
                            console.groupCollapsed('%cErrorInterceptor', 'font-size:1.25rem;color:red;background:black');            
                                console.log(error);                                        
                            console.groupEnd(); 
                        }

                        let errorMessage = '';
                        if (error.status === 401) {
                            // 401 : Pemission Denied
                            this.authenticationService.accessdenied();
                        } else if (error.status === 499) {
                            // 402 : Token Expired
                            this.authenticationService.tokenTimeOut();
                        } else if (error.error instanceof ErrorEvent) {
                            // client-side error
                            errorMessage = `Error: ${error.error.message}`;
                        } else {
                            // server-side error
                            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                        }
                                                            
                        return throwError(error);   
                    })
                )
    }
}