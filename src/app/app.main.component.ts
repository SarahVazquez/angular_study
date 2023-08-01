import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AppComponent } from './app.component';
import { MenuService } from '@_core/services';

@Component({
  selector: 'app-main',
  templateUrl: './app.main.component.html',
  animations: [
    trigger('mask-anim', [
        state('void', style({
            opacity: 0
        })),
        state('visible', style({
            opacity: 0.8
        })),
        transition('* => *', animate('250ms cubic-bezier(0, 0, 0.2, 1)'))
    ])
]
})
export class AppMainComponent {
  title = 'angular_study';

  menuClick: boolean;

  staticMenuActive: boolean;

  menuMobileActive: boolean;

  megaMenuClick: boolean;

  megaMenuActive: boolean;

  megaMenuMobileClick: boolean;

  megaMenuMobileActive: boolean;

  topbarItemClick: boolean;

  topbarMobileMenuClick: boolean;

  topbarMobileMenuActive: boolean;

  sidebarActive: boolean;

  activeTopbarItem: any;

  topbarMenuActive: boolean;

  menuHoverActive: boolean;

  configActive: boolean;

  constructor(private menuService: MenuService, public app: AppComponent) {}

  onLayoutClick() {
      if (!this.topbarItemClick) {
          this.activeTopbarItem = null;
          this.topbarMenuActive = false;
      }

      if (!this.megaMenuClick) {
          this.megaMenuActive = false;
      }

      if (!this.megaMenuMobileClick) {
          this.megaMenuMobileActive = false;
      }

      if (!this.menuClick) {
          if (this.isHorizontal()) {
              this.menuService.reset();
          }

          if (this.menuMobileActive) {
              this.menuMobileActive = false;
          }

          this.menuHoverActive = false;
      }

      this.menuClick = false;
      this.topbarItemClick = false;
      this.megaMenuClick = false;
      this.megaMenuMobileClick = false;
  }

  onMegaMenuButtonClick(event) {
      this.megaMenuClick = true;
      this.megaMenuActive = !this.megaMenuActive;
      event.preventDefault();
  }

  onMegaMenuClick(event) {
      this.megaMenuClick = true;
      event.preventDefault();
  }

  onTopbarItemClick(event, item) {
      this.topbarItemClick = true;

      if (this.activeTopbarItem === item) {
          this.activeTopbarItem = null; } else {
          this.activeTopbarItem = item; }

      event.preventDefault();
  }

  onTopbarMobileMenuButtonClick(event) {
      this.topbarMobileMenuClick = true;
      this.topbarMobileMenuActive = !this.topbarMobileMenuActive;

      event.preventDefault();
  }

  onMegaMenuMobileButtonClick(event) {
      this.megaMenuMobileClick = true;
      this.megaMenuMobileActive = !this.megaMenuMobileActive;

      event.preventDefault();
  }

  onMenuButtonClick(event) {
      this.menuClick = true;
      this.topbarMenuActive = false;

      if (this.isMobile()) {
          this.menuMobileActive = !this.menuMobileActive;
      }

      event.preventDefault();
  }

  onSidebarClick(event: Event) {
      this.menuClick = true;
  }

  onToggleMenuClick(event: Event) {
      this.staticMenuActive = !this.staticMenuActive;
      event.preventDefault();
  }

  isDesktop() {
      return window.innerWidth > 991;
  }

  isMobile() {
      return window.innerWidth <= 991;
  }

  isHorizontal() {
      return this.app.horizontalMenu === true;
  }

}