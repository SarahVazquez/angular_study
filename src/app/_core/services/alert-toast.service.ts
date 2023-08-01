import { Injectable } from '@angular/core';
import { MessageService, ConfirmationService} from 'primeng/api';
import { Message } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AlertToastService {
    public messages: Array<Message> = [];

    constructor(private messageService: MessageService, public confirmationService: ConfirmationService) { }
    clear() {
        console.log('-- Clearing all Toasts --');
        this.messageService.clear();
    }
    /*
        keytype
        1. tc : top center
        2. c  : confirm dialog
    */
    success(keytype: string, message: string) {
        this.messageService.add({key: keytype, severity:'success', summary: 'Success', detail:message});
    }

    error(keytype: string, message: string) {
        this.messageService.add({key: keytype, severity:'error', summary: 'Error', detail:message});
    }

    warn(keytype: string, message: string) {
        this.messageService.add({key: keytype, severity:'warn', summary: 'Warn', detail:message});
    }

    stickyWarn(keytype: string, message:string) {
        this.messageService.add({key: keytype, severity:'warn', summary: 'Warn', detail:message, sticky: true});
    }

    many(arr:string[]) {
        this.messages = arr.map(e => {
            return {key:'mm', severity:'warn', summary:'Warn', detail:e, life:10000}
        });
        this.messageService.addAll(this.messages);
    }
    onAnswer(key: string, answer: boolean) {
        this.messageService.clear(key);  
        return answer;    
    }
}