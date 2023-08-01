import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from '@_core/services';
import { environment } from '@_environments/environment';

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
    ShowConsoleMessages:boolean = environment.showConsoleMessages;

    constructor(private authenticationService: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
 
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if(this.ShowConsoleMessages){
            console.groupCollapsed('%cjwt interceptor', 'font-size:1rem;color:green;background:white');            
                console.log(currentUser);
            console.groupEnd();            
        }
      
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request).pipe(
            tap(event => {
              if (event.type === HttpEventType.Response) {
                const authorizationHeader = event.headers.get('Authorization');
                if(authorizationHeader && currentUser.token != authorizationHeader){
                    this.authenticationService.refreshToken(authorizationHeader.replace('Bearer ',''));                    
                    if(this.ShowConsoleMessages){
                        console.groupCollapsed('%cjwt interceptor-Incoming request :: Update Token','font-size:1rem;color:yellow;background:black');            
                            console.log('%c%s', 'font-size:1rem;color:yellow;background:black', authorizationHeader);       
                        console.groupEnd(); 
                    }
                }
              }
            })
          );
    }
}