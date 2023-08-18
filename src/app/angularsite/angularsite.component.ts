import { Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-angularsite',
  templateUrl: './angularsite.component.html',
  styleUrls: ['./angularsite.component.css'],
  providers: [],
  encapsulation: ViewEncapsulation.Emulated
})
export class AngularSiteComponent {
  title = 'Angular';
}
