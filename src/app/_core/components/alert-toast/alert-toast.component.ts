import { Component, OnInit } from '@angular/core';
import { AlertToastService } from '@_core/services';   //added @_core path in tsconfig.json 


@Component({
  selector: 'app-alert-toast',
  templateUrl: './alert-toast.component.html',
  styleUrls: ['./alert-toast.component.css']
})

export class AlertToastComponent implements OnInit {

    constructor(
        private alertToastService: AlertToastService
    ) { }

    ngOnInit() {  
    }

    onConfirmOrReject(answer: boolean) {
        this.alertToastService.onAnswer('c',answer);        
    }
}

