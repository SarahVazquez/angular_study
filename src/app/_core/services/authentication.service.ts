import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, timeInterval, timeout, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '@_core/models';
import { environment } from '@_environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    ShowConsoleMessages:boolean = environment.showConsoleMessages;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>; // same as SessionStorage

    constructor( private jwtHelperService: JwtHelperService,                 
                 private http: HttpClient,
                 private router: Router ) {
        let cu = sessionStorage.getItem('currentUser') == '' ? null : sessionStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(cu));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        if(this.ShowConsoleMessages) {
            console.groupCollapsed('login');
                console.log('%c%s', 'font-size:1.25rem;color:orange;background:black','AuthenticationService.login', username);
                console.log(`AuthenticationService.login: ${environment.apiUrl}/authenticate`);
            console.groupEnd();            
        }

        return this.http.post<any>(`${environment.apiUrl}/authenticate`, { username, password })
            .pipe(
                timeout(10000),
                map(user => {
                    this.ShowConsoleMessages && console.log('%cAuthenticationService.map', 'background-color:green;color:white;', user);
                    this.ShowConsoleMessages && console.log('%cAuthenticationService.map', 'background-color:green;color:white;', user.token);   
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        const jwt  = user.token;
                        let userDecode = this.jwtHelperService.decodeToken(jwt);
                        userDecode['fullName'] = `${userDecode.firstName} ${userDecode.lastName}`;
                        user = {...userDecode, token:jwt};                        
                        // store user details and jwt token in session storage to keep user logged in between page refreshes
                        sessionStorage.clear();
                        sessionStorage.setItem('currentUser', JSON.stringify(user));
                        sessionStorage.setItem('jwt', JSON.stringify(jwt));

                        this.currentUserSubject.next(user);
                    }
                    return user;
                }),
                catchError(err => {
                    this.ShowConsoleMessages && console.log('%cAuthenticationService.login.ERR','background-color:red;color:white;', err);
                    return throwError(err);
                })
            );
    }

    logout() {
        this.ShowConsoleMessages && console.log('%ccAuthenticationService.[LOGOUT]', 'background-color:OrangeRed; color:white;');
        
        sessionStorage.clear();
        this.currentUserSubject.next(null);

        this.router.navigate(['/login']);
    }

    isAuthorized(allowedRoles: string[]): boolean {
        if(allowedRoles == null || allowedRoles.length === 0 ) {
            this.ShowConsoleMessages && console.log('%cAuthenticationService.isAuthorized.ERR-No Allowed Roles', 'background-color:Red; color:white;');
            return false;
        }
        // get token from session storage or state management
        const currentUserToken = sessionStorage.getItem('jwt');
        if(currentUserToken){
            if(!Array.isArray(allowedRoles)){
                this.ShowConsoleMessages && console.log('%cAuthenticationService.isAuthorized.ERR-No Array for Allowed Roles', 'background-color:Red; color:white;');
                return false;
            }

            const decodeToken = this.jwtHelperService.decodeToken(currentUserToken);
            if (!decodeToken) {
                // Invalid token ########
                this.ShowConsoleMessages && console.log('%cAuthenticationService.isAuthorized.ERR-Invalid token', 'background-color:OrangeRed; color:white;');  
                return false;
              } else if(!decodeToken.hasOwnProperty("role")) {
                  // No Role Assigned
                  this.ShowConsoleMessages && console.log('%cAuthenticationService.isAuthorized.ERR-No Role Assigned', 'background-color:OrangeRed; color:white;');  
                  return false;
              }
              else {                  
                  this.ShowConsoleMessages && console.log('%cAuthenticationService.isAuthorized', 'background-color:green; color:black;', allowedRoles, decodeToken['role']);                    
  
                  if (typeof allowedRoles === 'string') {
                      // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
                      return decodeToken['role'].find((role)=>role==allowedRoles) != -1;
                  }
                  else {
                      // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
                      return this.compareArray(allowedRoles,decodeToken['role']).length != 0;
                  }
              }
        }
        else{
            this.ShowConsoleMessages && console.log('%cAuthenticationService.isAuthorized', 'background-color:red; color:black;',"No Current Token");  
            return false;
        }
    }

    initialized() {
        this.ShowConsoleMessages && console.log('%ccAuthenticationService.[initialized]', 'background-color:OrangeRed; color:white;');
        sessionStorage.clear();
        this.currentUserSubject.next(null);      
        this.router.navigate(['/login']);
    }

    accessdenied() {
        this.ShowConsoleMessages && console.log('%ccAuthenticationService.[Access Denied]', 'background-color:OrangeRed; color:white;');        
        this.router.navigate(['/accessdenied']);
    }

    tokenTimeOut() {
        this.ShowConsoleMessages && console.log('%ccAuthenticationService.[Token expired]', 'background-color:OrangeRed; color:white;');
        sessionStorage.clear();
        this.currentUserSubject.next(null);
        this.router.navigate(['/expired']);
    }

    isExpired() {        
        let token = sessionStorage.getItem("jwt");
        return !token && this.jwtHelperService.isTokenExpired(token);
    }

    existToken(){
        let token = sessionStorage.getItem("jwt");
        return token ? true : false;
    }
    
    refreshToken(jwt: string) {
        this.ShowConsoleMessages && console.log("*#*#*#*#*#*#**#*#*#  refreshToken *#*#*#**#*#*#*#*#*",jwt);
        var user = this.jwtHelperService.decodeToken(jwt);
        user['fullName'] = `${user.firstName} ${user.lastName}`;                
        user = {...user, token:jwt};
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        sessionStorage.setItem('jwt', JSON.stringify(jwt));
        this.currentUserSubject.next(user);
    }

    registerNewUser(user: any) {
        let apiUrl =  `${environment.apiUrl}/users/register`;
        return this.http.post(apiUrl, user);
    }

   
    userHasRole(role:string | string[]): boolean {
        this.ShowConsoleMessages && console.log('userHasRole:', {role} );
        let decoded;
        const token = sessionStorage.getItem('jwt');
        try {
            //decoded = this.jwtHelperService.decodeToken(token);
            let userRole:Array<string> = this.currentUserValue['role'] as unknown as Array<string>;
            this.ShowConsoleMessages && console.log('userHasRole:', {userRole});
            if(Array.isArray(role)) {
                return this.compareArray(userRole, role).length ? true : false;
            } else {
                return userRole.map(e => e.toLowerCase()).includes(role.toLowerCase());
            }
        } catch(e) {
            this.ShowConsoleMessages && console.error('AuthenticationService.userHasRole', e);
            return false;
        }
    }

    private compareArray(arr1: string[],arr2: string[]){
        const finalarray = [];
        
        arr1.forEach(e1 => {
            arr2.forEach(e2 => {
                if(e1.toLowerCase() === e2.toLowerCase()){
                    finalarray.push(e1);
                }
            })
        });

        return finalarray;
    }
}