import { AuthenticationService } from '@_core/services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '@_core/models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  errMsg: string;
  displayModal:boolean = false;
  spinnerResourcesLoaded:boolean = false;
  editMode = false;

  user:any = {
    ern: '',
    firstName: '',
    lastName: '',
    title: '',
    team: '',
    // room: '',
    phoneno: '',
    email: '',
    role: '',
  }

  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  ngOnDestroy(): void {
  }
  ngOnInit(): void {
  }

  isFieldInvalid(fieldName: string): boolean {
    return !this.user[fieldName];
  }

  clearForm(): void {
    console.log("Clearing the form...");

    this.user = {
        ern: '',
        firstName: '',
        lastName: '',
        title: '',
        team: '',
        // room: '',
        phoneno: '',
        email: '',
        role: '',
    };
    this.errMsg = '';   
}

  createUser(): void {
    if (this.isFieldInvalid('firstName') || this.isFieldInvalid('lastName')) {
      this.errMsg = "Please fill in all required fields."
      return;
    }

    this.user.username = this.user.firstName.toLowerCase() + '.' + this.user.lastName.toLowerCase();
    this.user.title;
    this.user.team;
    // this.user.room;
    this.user.role;
    this.user.phoneno;
    this.user.email;
    this.user.firstName;
    this.user.lastName;
    this.user.ern;
    
    this.spinnerResourcesLoaded = true;
    this.authenticationService.registerNewUser(this.user).subscribe(
      (response) => {
        setTimeout(() => {
          this.spinnerResourcesLoaded = false;
          this.showModal();
          console.log('Success!');
          this.clearForm();
        }, 2000);
      },
      (error) => {
          this.spinnerResourcesLoaded = false;
          console.log('Error occurred:', error);
          this.errMsg = error.error.message;
          console.log 
      }
    );
  }

  showModal(){
    this.displayModal = true;
  }
  

}
