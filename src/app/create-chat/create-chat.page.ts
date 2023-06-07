import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth} from '@angular/fire/compat/auth';
import { AuthService } from '../auth.service';
import firebase from 'firebase/compat/app';
import {Router } from '@angular/router';

@Component({
  selector: 'app-create-chat',
  templateUrl: './create-chat.page.html',
  styleUrls: ['./create-chat.page.scss'],
})
export class CreateChatPage implements OnInit {
  chatName: string='' ;
  description: string ='';
  file: any;
  photoURL: string | undefined;
  cuser: undefined;
  constructor(private router:Router, private authservice: AuthService, private fireauth: AngularFireAuth,  private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
  }
  
  async createChat() {
    // Yeni sohbet için doküman oluşturma
    const chatDocRef = this.firestore.collection('chats').doc();
    const chatId = chatDocRef.ref.id;
  
    // Sohbet verilerini hazırlama
    await this.authservice.getUserData().then(currentUser => {
      this.cuser = currentUser.uid;
    });
  
    // Chat adı ve açıklamasını küçük harflere dönüştürme
    const lowercaseChatName = this.chatName.toLowerCase();
    const lowercaseDescription = this.description.toLowerCase();
  
    // Chat adı ve açıklamasını boşluklardan ayırarak kelimelere ayırma
    const chatNameWords = lowercaseChatName.split(' ');
    const descriptionWords = lowercaseDescription.split(' ');
  
    // Search index oluşturma
    const searchIndex = chatNameWords.concat(descriptionWords);
  
    const chatData = {
      chatId: chatId,
      chatName: this.chatName,
      description: this.description,
      searchindex: searchIndex, // Diziyi direkt olarak kaydetme
  
      messages: [],
      users: [this.cuser!],
    };
  
    // Firestore'a sohbeti kaydetme
    await chatDocRef.set(chatData)
      .then(async () => {
        console.log('Sohbet başarıyla oluşturuldu:', chatId);
  
        // Şuanki kullanıcının chat listesine eklenmesi
        await this.authservice.getUserData().then(async currentUser => {
          if (currentUser) {
            const userChatRef = this.firestore.collection('users').doc(currentUser.uid);
            await userChatRef.update({
              chats: firebase.firestore.FieldValue.arrayUnion(chatId)
            })
            .then(() => {
              console.log('Kullanıcının sohbet listesi güncellendi');
              this.routehome();
            })
            .catch((error) => {
              console.error('Kullanıcının sohbet listesini güncelleme hatası:', error);
            });
          }
        });
  
        // İşlem tamamlandıktan sonra sayfayı kapatma veya başka bir işlem yapma
      })
      .catch((error) => {
        console.error('Sohbet oluşturma hatası:', error);
      });
  }
  routehome(){
    this.router.navigate(['/home']);
  }

}
