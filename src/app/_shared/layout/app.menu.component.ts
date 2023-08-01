import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from '@_app/app.main.component';
import { Menu } from '@_core/models';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public appMain: AppMainComponent) {}

    ngOnInit() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.model = Menu.filter(item => {
            return !item.perm || currentUser.role.some(r => item.perm.map(str => str.toLocaleLowerCase()).includes(r.toLocaleLowerCase()));
        });
    }

    onMenuClick() {
        this.appMain.menuClick = true;
    }
}
