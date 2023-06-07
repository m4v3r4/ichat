import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  chats: any[] = []; // Sohbetleri tutmak için boş bir dizi
  currentUser: User | null = null; // Şu anki kullanıcı
  
 

  constructor( private afAuth: AngularFireAuth,private router: Router,private authService: AuthService,private firestore: AngularFirestore) {}
  
  ngOnInit() {
   this.authService.isLoggedIn()
    this.getUserData().then((user) => {
      this.currentUser = user;
      this.getChats();
    });
  }
  ionViewDidEnter() {
    this.getChats();
  }
  
  getUserData(): Promise<User | null> {
    return new Promise<User | null>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user as User);
        } else {
          resolve(null);
        }
      }, reject);
    });
  }
  async getChats() {
  
    if (this.currentUser) {
      const chatsRef = this.firestore.collection('chats');
  
      await chatsRef
        .get()
        .subscribe((snapshot: QuerySnapshot<any>) => {
          const chats: any[] = [];
  
          snapshot.forEach((doc) => {
            const chatData = doc.data() as {
              description: any;
              chatName: any; 
              users: string[] 
};
            const users = chatData.users;
  
            if (users.includes(this.currentUser!.uid)) {
              const chat = {
                chatId: doc.id,
                chatName: chatData.chatName,
                description: chatData.description,
              };
             
              chats.push(chat);
            }
          });
  
          this.chats = chats;
        }, (error) => {
          console.log('Sohbetleri alma işlemi başarısız oldu:', error);
        });
        console.log(this.chats);
  }
    }
    
    navigateToChat(chatId: string) {
      console.log("çalıştı")
      this.router.navigate(['/chat/',chatId]);
    }
 
  navigateToCreate() {
    this.router.navigate(['/create-chat']);
  }
  navigateToSearch() {
    this.router.navigate(['/search-page']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile-page']);
  }
}
