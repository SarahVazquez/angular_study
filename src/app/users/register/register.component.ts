import { AuthenticationService } from '@_core/services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  constructor(private authenticationService: AuthenticationService) {

  }

  ngOnDestroy(): void {
  }
  ngOnInit(): void {
  }

}
