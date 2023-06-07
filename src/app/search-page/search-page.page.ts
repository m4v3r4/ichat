import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.page.html',
  styleUrls: ['./search-page.page.scss'],
})
export class SearchPagePage implements OnInit {
  chats: any[] = [];
  
  constructor(private router:Router,private firestore: AngularFirestore,private auth: AngularFireAuth) { }

  ngOnInit() {
   
  } 
  ionViewDidEnter() {
    const event = { target: { value: ' ' } };
    console.log("çalıştı")
  this.search(event);
}
async search(event: any) {
  const query = event.target.value.trim().toLowerCase();

  if (query !== '') {
    await this.firestore
      .collection('chats')
      .valueChanges()
      .subscribe((results: any[]) => {
        this.chats = results.filter((chat: any) => {
          const searchIndex: string[] = chat.searchindex;
          for (let i = 0; i < searchIndex.length; i++) {
            if (searchIndex[i].includes(query)) {
              return true;
            }
          }
          return false;
        });
      });
  } else {
    await this.firestore
      .collection('chats')
      .valueChanges()
      .subscribe((results: any[]) => {
        this.chats = results;
      });
  }
}

  
  routehome(){
    this.router.navigate(['/home']);
  }

  joinChat(chat: any) {
    this.auth.currentUser.then((currentUser) => {
      if (currentUser) {
        const currentUserUid = currentUser.uid;
        const chatId = chat.chatId;
  
        // Firestore'da sohbetin users kısmını güncellemek için işlem yapın
        const fieldValue = firebase.firestore.FieldValue;
        const chatUpdate = {
          users: fieldValue.arrayUnion(currentUserUid),
        };
        
        const batch = this.firestore.firestore.batch();
  
        // Seçilen sohbetin users kısmını güncelle
        const chatRef = this.firestore.collection('chats').doc(chatId).ref;
        batch.update(chatRef, chatUpdate);
  
        // Kullanıcının chats kısmına chat ID'sini ekle
        const userRef = this.firestore.collection('users').doc(currentUserUid).ref;
        const userUpdate = {
          chats: fieldValue.arrayUnion(chatId),
        };
        batch.update(userRef, userUpdate);
  
        // İşlemi gerçekleştir
        batch.commit()
          .then(() => {
            console.log('Sohbete katılım başarılı.');
            this.routehome();
          })
          .catch((error) => {
            console.error('Sohbete katılım hatası:', error);
          });
      }
    });
  }
}
