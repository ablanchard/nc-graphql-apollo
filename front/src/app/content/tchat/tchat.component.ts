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
        this.tchatService.getMessages().valueChanges
          .subscribe(
            (next : any) => this.messages = next.data.getMessages,
            (error) => console.log(error)
          )
    }

    sendMessage() {
        this.spamGuard = true
      let message = {
        content: this.messageContent,
        localisation: "Devoxx",
        status: "PENDING",
        sender: {
          pseudo: "Current user",
          firstName: "John",
          lastName: "Doe"
        }
      };
      this.tchatService.saveMessage(message).subscribe(
          (next : any) => {this.spamGuard = false;},
          (error) => console.log(error)
        );
        this.messageContent = ""
    }
}
