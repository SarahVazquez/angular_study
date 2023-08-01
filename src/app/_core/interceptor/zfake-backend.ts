import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import * as userlist from '@_core/models/data/userlist.json';
import * as usernroles from '@_core/models/data/usernroles.json';

@Injectable({ providedIn: 'root' })
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
        let userrole: any = JSON.parse(localStorage.getItem('usernroles')) || {};
        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/authenticate') && request.method === 'POST') {
                localStorage.clear();
                localStorage.setItem("users", JSON.stringify(userlist['default']));
                localStorage.setItem("usernroles", JSON.stringify(usernroles['default']));
                users = JSON.parse(localStorage.getItem("users"));
                userrole = JSON.parse(localStorage.getItem("usernroles"));

                // find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.username.toLowerCase() === request.body.username.toLowerCase() && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let user = filteredUsers[0];
                    console.log("Back-end : /users/authenticate : POST", user);  
                    sessionStorage.clear();
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    sessionStorage.setItem('jwt', JSON.stringify(user.token));   

                    let body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        token: user.token
                    };                     
                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return throwError({ error: { message: 'Username or password is incorrect' } });
                }
            }

            // get usernroles
            if (request.url.endsWith('/admin/usernroles') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                //console.log("****** Header ******" );
                //console.log(request.headers.get('Authorization') );
                console.log("Back-end : /admin/usernroles : GET",userrole);                  
                return of(new HttpResponse({ status: 200, body: userrole }));                
            }

            // register user
            if (request.url.endsWith('/users/register') && request.method === 'POST') {
                // get new user object from post body
                let newUser = request.body;

                // validation
                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                if (duplicateUser) {
                    return throwError({ error: { message: 'Username "' + newUser.username + '" is already taken' } });
                }
                
                let tkn = new JwtHelperService();
                // save new user
                const curmaxid = users.length!=0?(Math.max.apply(Math, users.map(function(user) { return user.userid; }))):0;
                newUser.userid = curmaxid + 1;
                newUser.role = ['user'];                
                newUser.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsInJvbGUiOiJhZG1pbiIsImp0aSI6IjMwYzlhMDhkLWZjODYtNDQ0NC1iMTQ4LTg2Y2YyMDc4OGY2YiIsImlhdCI6MTUzODEzODMzNSwiZXhwIjo0MDk1NzkyMDAwfQ.CZFi57pHNjHOmkyRcs1s557hO0JMp2Fq_k0As1OEAoM';                
                users.push(newUser);
                newUser.obj_roles =[];
                newUser.displayName = newUser.firstName + " " + newUser.lastName;
                newUser.ref_group_id = null;
                newUser.group_name = null;                
                userrole['users'].push(newUser);

                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('usernroles', JSON.stringify(userrole));

                // respond 200 OK
                console.log("Back-end : /users/register : POST");  
                return of(new HttpResponse({ status: 200 }));
            }

             // update user
            if (request.url.match(/\/admin\/user\/\d+$/) && request.method === 'POST') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application              
                    let updateUser = request.body;                    
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);                    
                    for (let i = 0; i < users.length; i++) {                        
                        if (users[i].userid == id) {
                            users[i].displayName = updateUser.displayName ;
                            users[i].firstName = updateUser.firstName ;
                            users[i].lastName = updateUser.lastName ;
                            users[i].username = updateUser.username ;
                            users[i].email = updateUser.email ;
                            users[i].ern = updateUser.ern ;
                            users[i].team = updateUser.team ;
                            users[i].title = updateUser.title ;
                            users[i].phoneno = updateUser.phoneno ;                            
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    for (let i = 0; i < userrole['users'].length; i++) {                        
                        if (userrole['users'][i].userid == id) {
                            userrole['users'][i].displayName = updateUser.displayName ;
                            userrole['users'][i].firstName = updateUser.firstName ;
                            userrole['users'][i].lastName = updateUser.lastName ;
                            userrole['users'][i].username = updateUser.username ;
                            userrole['users'][i].email = updateUser.email ;
                            userrole['users'][i].ern = updateUser.ern ;
                            userrole['users'][i].team = updateUser.team ;
                            userrole['users'][i].title = updateUser.title ;
                            userrole['users'][i].phoneno = updateUser.phoneno ;                            
                            localStorage.setItem('usernroles', JSON.stringify(userrole));
                            break;
                        }
                    }
                    // respond 200 OK
                    console.log("Back-end : /users/{userid} : POST");  
                    return of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application                
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    console.log("Back-end : /users/{userid} : DELETE");  
                    return of(new HttpResponse({ status: 200 }));
            }

            // pass through any requests not handled above
            return next.handle(request);            
        }))
        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(3000))
        .pipe(dematerialize());
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
