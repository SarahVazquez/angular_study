import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppMainComponent} from '@_app/app.main.component';
import { AuthenticationService } from '@_core/services';
import { environment } from '@_environments/environment';

@Component({
    selector: 'app-topbar',
	templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit, OnDestroy {

    activeItem: number;
    currentUser: any;
    isAdminRole: boolean = false;

    constructor(
        public appMain: AppMainComponent,
        private authenticationService: AuthenticationService
    ) {}

    ngOnDestroy(): void {
        
    }
    ngOnInit(): void {
        this.authenticationService.currentUser.subscribe(user => {
            if (user != null) {
                this.currentUser = user;
                const userRoles = user['role'] as any;
                userRoles.map(item => {
                    if('admin' === item) {
                        this.isAdminRole = true;
                    }
                })
            }
        });
        
    }

    mobileMegaMenuItemClick(index) {
        this.appMain.megaMenuMobileClick = true;
        this.activeItem = this.activeItem === index ? null : index;
    }

    onSignOut() {
        this.authenticationService.logout();
    }
}
