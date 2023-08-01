  import { HttpInterceptor,HttpRequest,HttpHandler,HttpEventType } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { tap } from 'rxjs/operators';
  import { environment } from '@_environments/environment';
  
  @Injectable({ providedIn: 'root' })
  export class LoggingInterceptorService implements HttpInterceptor {
    ShowConsoleMessages:boolean = environment.showConsoleMessages;

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
        if(this.ShowConsoleMessages){
            console.groupCollapsed('%cLoggingInterceptorService-Outgoing request','font-size:1rem;color:orange;background:black');            
                console.log('%c%s', 'font-size:1rem;color:orange;background:black', req.url);
                console.log(req.headers);
            console.groupEnd(); 
        }
  
      return next.handle(req).pipe(
        tap(event => {
          if (event.type === HttpEventType.Response) {

            if(this.ShowConsoleMessages){
                console.groupCollapsed('%cLoggingInterceptorService-Incoming request','font-size:1rem;color:yellow;background:black');            
                    console.log('%c%s', 'font-size:1rem;color:yellow;background:black', req.url);
                    console.log(req.headers);            
                console.groupEnd(); 
            }
            
          }
        })
      );
    }
  }
  