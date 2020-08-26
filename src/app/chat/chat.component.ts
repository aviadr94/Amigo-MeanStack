import { Component, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})

export class ChatComponent implements OnInit {

  user: string;
  room: string;
  messageText: string;
  messageArray: Array<{user: string; message: string; }> = [];

  userIsAuthenticated = false;
  userId: string;
  userEmail: string;
  private authStatusSub: Subscription;

  constructor(private chatService: ChatService, private authService: AuthService) {
    this.chatService.newUserJoined()
      .subscribe(data => this.messageArray.push(data));
    this.chatService.userLeftRoom()
      .subscribe(data => this.messageArray.push(data));
    this.chatService.newMessageReceived()
      .subscribe(data => this.messageArray.push(data));
  }
  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        this.userEmail = localStorage.getItem('userEmail');
      });
  }

  userIsAuth() {
    if (!this.userIsAuthenticated) {
      return false;
    }

    this.userEmail = localStorage.getItem('userEmail');
    this.user = this.userEmail;
    return true;
  }

  join() {
    console.log('Join Chat Clicked');
    this.chatService.joinRoom({ user: this.user, room: this.room });
  }
  leave() {
    this.chatService.leaveRoom({ user: this.user, room: this.room });
  }
  sendMessage() {
    this.chatService.sendMessage({ user: this.user, room: this.room, message: this.messageText });
  }
}

