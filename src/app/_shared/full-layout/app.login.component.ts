import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '@_core/services';
import { environment } from '@_environments/environment';



@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  styleUrls: ['./app.login.component.css']
})
export class AppLoginComponent implements OnInit {
    ShowConsoleMessages:boolean = environment.showConsoleMessages;
    txt_loginpage: string = environment.txt_loginpage;
    loginBGColor:string = environment.loginBGColor || 'white';
    spinnerResourcesLoaded:boolean = false;    
    submitted: boolean = false;
    loginForm: FormGroup;
    username: string;
    password: string;
    errMsg: boolean = false;
    errMsgUsername: string;
    errMsgPwd: string;

    constructor(       
      private router: Router,
      private authenticationService: AuthenticationService,
      private formBuilder: FormBuilder,
    ) {
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
    }

    ngOnInit() {
      this.ShowConsoleMessages && console.log('%cLogin.Init', 'background-color:green;color:white;');
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
      this.submitted = true;
      this.username = this.f['username'].value;
      this.password = this.f['password'].value;

      if (this.loginForm.invalid) {
/*
*   show error message if username or password is empty
*/
        return;
      } 
      else{
        this.spinnerResourcesLoaded = true;
        this.authenticationService.login(this.username, this.password)
            .pipe(first())
            .subscribe(
                data => {                
                  setTimeout(() => {
                    this.spinnerResourcesLoaded = false;
                    this.router.navigate(['/']);
                  }, 2000);
                },
                error => {
                  this.ShowConsoleMessages && console.log('%cLoginComponent.onSubmit.ERR','background-color:red;color:white;', error);
                  const defaultErrorMessage = "Login Error !!!";
                  
                  if(error instanceof HttpErrorResponse) {
                    this.ShowConsoleMessages && console.log('%cHttpErrorResponse','background-color:red;color:white;',error);
                    this.errMsgPwd = error.error.message ? error.error.message : (error.statusText ? error.statusText : defaultErrorMessage);
                  } else {
                    this.ShowConsoleMessages && console.log('%cOther','background-color:red;color:white;',error);
                    this.errMsgPwd = error.error.message ? error.error.message : (error.statusText ? error.statusText : defaultErrorMessage);
                  }
                  this.errMsgUsername = defaultErrorMessage;
                  this.errMsg = true;
                  this.spinnerResourcesLoaded = false;
                });
      }      
    }
}