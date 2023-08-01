import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '@_environments/environment';  
import { User } from '@_core/models';   //added @_core path in tsconfig.json

const ShowConsoleMessages:boolean = environment.showConsoleMessages;


@Injectable({ providedIn: 'root' })
export class UserService {
private api = `${environment.apiUrl}/`;

  constructor( private http: HttpClient ) {
  }

  getAllUsers(): Observable <any> {
    let apiUrl = this.api + 'admin/usernroles';
    return this.http.get(apiUrl).pipe();
  }

  updateUserInfo(data:any): Observable<any> {
    return this.http.post(this.api + 'admin/user/' + data.userid, data);
  }

}


