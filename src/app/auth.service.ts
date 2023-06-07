import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;

  constructor(private router: Router, private afAuth: AngularFireAuth) { }

  // Giriş yapma işlevi
  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }
  
  updateProfilePhoto(profilePhotoURL: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.currentUser
        .then((user) => {
          if (user) {
            return user.updateProfile({
              photoURL: profilePhotoURL,
              
            });
          } else {
            reject(new Error('Kullanıcı bulunamadı.'));
            return null;
          }
        })
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  isLoggedIn() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        return this.router.navigate(['/home']);
      } else {
        return this.router.navigate(['/login']);
      }
    });
  }

  getUserData(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user); // Kullanıcı mevcut ise kullanıcıyı döndür
        } else {
          resolve(null); // Kullanıcı mevcut değilse null döndür
        }
      }, reject);
    });
  }

  // Kayıt olma işlevi
  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Çıkış yapma işlevi
  signOut() {
    return this.afAuth.signOut();
  }

 // E-posta adresini güncelleme işlevi
changeEmail(newEmail: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.afAuth.currentUser
      .then((user) => {
        if (user) {
          return user.updateEmail(newEmail);
        } else {
          reject(new Error('Kullanıcı bulunamadı.'));
          return null;
        }
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Profili güncelleme işlevi
updateProfile(displayName: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.afAuth.currentUser
      .then((user) => {
        if (user) {
          return user.updateProfile({
            displayName: displayName,
            
          });
        } else {
          reject(new Error('Kullanıcı bulunamadı.'));
          return null;
        }
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}


// Şifreyi değiştirme işlevi
changePassword(newPassword: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    this.afAuth.currentUser
      .then((user) => {
        if (user) {
          return user.updatePassword(newPassword);
        } else {
          reject(new Error('Kullanıcı bulunamadı.'));
          return null;
        }
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
}
}
