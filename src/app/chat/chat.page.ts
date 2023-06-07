import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { IonContent,ToastController  } from '@ionic/angular';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage   {
  @ViewChild('content', { static: false })
  content!: IonContent;

  chatId: string | undefined;
  messages: any[] = [];
  newMessage: string = '';
  currentUserUid :string | undefined;
  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
    private toastController: ToastController
  ) {}
  
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('id') || undefined;
    this.getChatMessages();
    this.getCurrentUserUid();
   
    
  }
  
  async getCurrentUserUid() {
    const currentUser = await this.auth.currentUser;
    if (currentUser) {
      this.currentUserUid  = currentUser.uid;
    }
  }
  

  getChatMessages() {
    
    this.firestore
      .collection('chats')
      .doc(this.chatId)
      .collection('messages', (ref) => ref.orderBy('timestamp'))
      .valueChanges({ idField: 'messageId' })
      .subscribe((messages: any[]) => {
        this.messages = messages;
      });
      this.getCurrentUserUid()
  }
  ionViewDidEnter() {
    this.sendMessage();
  }
  formatDate(timestamp: any): string {
    const date = new Date(timestamp.seconds * 1000);
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return formattedDate;
  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.auth.currentUser.then((currentUser) => {
        if (currentUser) {
          const currentUserUid = currentUser.uid;
          const timestamp = firebase.firestore.FieldValue.serverTimestamp();

          this.firestore
            .collection('chats')
            .doc(this.chatId)
            .collection('messages')
            .add({
              content: this.newMessage,
              senderuid: currentUserUid,
              sendername: currentUser.displayName,
              senderphoto:currentUser.photoURL,
              timestamp: timestamp,
            })
            .then(() => {
              this.newMessage = '';
              this.presentToast('Mesaj Gönderildi');
              
                
              
            })
            .catch((error) => {
              this.presentToast('Mesaj gönderme hatası:'+error);
            });
        }
      });
    }
  }
}

