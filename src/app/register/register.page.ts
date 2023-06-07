import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth, updateProfile } from "firebase/auth";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private authService: AuthService, private firestore: AngularFirestore,private router: Router) { }
  firstName: string="";
  
  lastName: string="";
  email: string="";
  password: string="";
  error: string="";

  register() {
    const fullName = this.firstName + ' ' + this.lastName;
    const auth = getAuth();

    this.authService.register(this.email, this.password)
      .then((userCredential) => {
        // Kayıt başarılı
        // Firestore'da kullanıcının verilerini kaydedin
        const user = {
          fullName: fullName,
          email: this.email,
          uid: userCredential.user!.uid,
          chats: [], // Kullanıcının sohbetlerini tutmak için boş bir dizi
           // Kullanıcının arkadaşlarını tutmak için boş bir dizi
        };
        this.firestore.collection('users').doc(userCredential.user!.uid).set(user)
          .then(() => {
            this.error = "kayıt başarılı";
            updateProfile(auth.currentUser!, {
              displayName: fullName, photoURL: "https://example.com/jane-q-user/profile.jpg"
            }).then(() => {
              // Profile updated!
              // ...
            }).catch((error) => {
              // An error occurred
              // ...
            });
            this.router.navigate(['/login']);
          })
          .catch((error) => {
            console.log(error);
            this.error = error.message.toString();
          });
      })
      .catch((error) => {
        // Kayıt başarısız
        console.log(error);
        this.error = error.message.toString();
        
      });
  }
  

  login(){
    this.router.navigate(['/login']);
  }
  ngOnInit() {
  }

}
