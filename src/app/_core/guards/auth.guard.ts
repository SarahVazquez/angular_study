import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { filter, Subject, of, switchMap } from 'rxjs';
import { takeUntil  } from 'rxjs/operators';
import { AuthenticationService } from '@_core/services';   //added @_core path in tsconfig.json 
import { environment } from '@_environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild  {
    ShowConsoleMessages:boolean = environment.showConsoleMessages;
    private readonly _destroying$ = new Subject < void > ();    

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const allowedRoles   = route.data['allowedRoles'];
        const isAuthorized   = this.authenticationService.isAuthorized(allowedRoles);
        const isTokenExpired = this.authenticationService.isExpired();
        const existToken     = this.authenticationService.existToken();

        this.ShowConsoleMessages && console.log("%c#### auth canActivate ####", 'font-size:1rem;color:black;background:aqua',allowedRoles,isAuthorized,existToken);
        if (!isAuthorized && !existToken) {
            this.authenticationService.initialized();
        }
        else if (!isAuthorized) {
            this.authenticationService.accessdenied();
        }        
        else if(isTokenExpired){
            this.ShowConsoleMessages && console.log('%cAuthenticationService.isAuthorized.ERR-Token Expired', 'background-color:Red; color:white;');
            this.authenticationService.tokenTimeOut();
        }

        return isAuthorized||!isTokenExpired;   
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {                
        const allowedRoles   = route.data['allowedRoles'];
        const isAuthorized   = this.authenticationService.isAuthorized(allowedRoles);
        const isTokenExpired = this.authenticationService.isExpired();
        const existToken     = this.authenticationService.existToken();
        
        this.ShowConsoleMessages && console.log("%c#### auth canActivate ####", 'font-size:1rem;color:black;background:aqua',allowedRoles,isAuthorized,existToken);
        if (!isAuthorized && !existToken) {
            this.authenticationService.initialized();
        }
        else if (!isAuthorized) {
            this.authenticationService.accessdenied();
        }        
        else if(isTokenExpired){
            this.ShowConsoleMessages && console.log('%cAuthenticationService.isAuthorized.ERR-Token Expired', 'background-color:Red; color:white;');
            this.authenticationService.tokenTimeOut();
        }

        return isAuthorized||!isTokenExpired;
    }
}