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
          .subscribe(
            (next : any) => this.messages = next.data.getMessages,
            (error) => console.log(error)
          )
    }

    sendMessage() {
        this.spamGuard = false
        this.messageContent = ""
    }
}
