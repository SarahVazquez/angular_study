import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from "@auth0/angular-jwt";

import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
// PrimeNG Components
import { PrimeNGModule } from '@_shared/primeng.module';
// Angular Material Components
import { MaterialModule } from '@_shared/material.module';
// Custom
import { ProgressSpinnerModule } from '@_shared/progress-spinner-w-overay/progress-spinner-w-overay.module';

// Application services
import { JwtInterceptor,ErrorInterceptor,LoggingInterceptorService,fakeBackendProvider } from '@_core/interceptor';
import { AlertToastComponent } from '@_core/components/alert-toast/alert-toast.component';
import { MenuService, UserService } from '@_core/services';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
// Application Components - main grid
import { AppMenuComponent } from '@_shared/layout/app.menu.component';
import { AppMenuitemComponent } from '@_shared/layout/app.menuitem.component';
import { AppTopBarComponent } from '@_shared/layout/app.topbar.component';
import { AppFooterComponent } from '@_shared/layout/app.footer.component';
import { AngularSiteComponent } from './angularsite/angularsite.component';

// Application Components - settings
import { RegisterComponent } from './users/register/register.component';
import { UserManagementComponent } from './users/user-management/user-management.component';

// Application Components - full page
import { AppLoginComponent } from '@_shared/full-layout/app.login.component';
import { AppNotfoundComponent } from '@_shared/full-layout/app.notfound.component';
import { AppErrorComponent } from '@_shared/full-layout/app.error.component';
import { AppAccessdeniedComponent } from '@_shared/full-layout/app.accessdenied.component';

@NgModule({
  declarations: [
    AppComponent,
    AppMainComponent,
    AlertToastComponent,
    AppLoginComponent,
    AppNotfoundComponent,
    AppErrorComponent,
    AppAccessdeniedComponent,
    AppMenuComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AngularSiteComponent,
    RegisterComponent,
    UserManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,    
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PrimeNGModule,
    MaterialModule,
    ProgressSpinnerModule,
    JwtModule.forRoot({
        config: {
          tokenGetter: function tokenGetter() {
            return sessionStorage.getItem("jwt");
          },
          //headerName: "Your Header Name",    // The default header name is Authorization.
          throwNoTokenError: false,            // Setting throwNoTokenError to true will result in an error being thrown if a token cannot be retrieved with the tokenGetter function
        }
    }) 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    fakeBackendProvider,MenuService,UserService,
    DatePipe, CurrencyPipe, TitleCasePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
