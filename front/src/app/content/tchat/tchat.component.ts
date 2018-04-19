import { Component, OnInit } from '@angular/core';
import { TchatService } from '../../service'
import { tap } from 'rxjs/operators'

@Component({
    selector: 'app-tchat',
    templateUrl: './tchat.component.html',
    styleUrls: ['./tchat.component.css']
})
export class TchatComponent implements OnInit {

    public spamGuard = false
    public messageContent = ""
    public messages = []

    constructor(private tchatService: TchatService) { }

    ngOnInit() {
        this.tchatService.getMessages()
            .subscribe(({ data: { getMessages } }: any) => {
                this.messages = getMessages
            })
    }

    sendMessage() {
        this.spamGuard = false
        this.messageContent = ""
    }
}
