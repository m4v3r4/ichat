import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements OnInit {
  user: firebase.User | null = null;
  userDisplayName: string = '';
  profilePhotoURL:string="";
  userEmail: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private toastController:ToastController,
    private modalController: ModalController,

  ) {}
  
  async ngOnInit() {
    await this.authService.getUserData().then((user: firebase.User | null) => {
      if (user) {
        this.user = user;
        this.userDisplayName = user.displayName || '';
        this.userEmail = user.email || '';
        this.profilePhotoURL=user.photoURL||'';
        
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  
  updateProfilePhoto() {
    // Profil resmi URL'sini kullanıcı verilerine kaydetme
    this.authService.updateProfilePhoto(this.profilePhotoURL)
      .then(() => {
        console.log('Profil resmi güncellendi');
        // İşlem tamamlandıktan sonra sayfayı kapatma veya başka bir işlem yapma
      })
      .catch((error) => {
        console.error('Profil resmi güncelleme hatası:', error);
      });
  }
  
  async updateProfile() {
    try {
      await this.authService.updateProfile(this.userDisplayName);
      this.changeEmail();
      this.presentToast('Profil güncellendi.');
    } catch (error) {
      this.presentToast('Profil güncellenirken bir hata oluştu: '+error);
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  
  async changeEmail() {
    try {
      await this.authService.changeEmail(this.userEmail);
      this.presentToast('E-posta adresi güncellendi.');
    } catch (error) {
      this.presentToast('E-posta adresi güncellenirken bir hata oluştu:'+error);
    }
  }
  

  async changePassword() {
    try {
      if (this.newPassword !== this.confirmPassword) {
        this.presentToast('Şifreler eşleşmiyor.');
        return;
      }
      await this.authService.changePassword(this.newPassword);
      this.presentToast('Şifre güncellendi.');
    } catch (error) {
      this.presentToast('Şifre güncellenirken bir hata oluştu:'+ error);
    }
  }

  logout() {
    this.authService.signOut().then(() => {
      this.presentToast('Oturum Kapatıldı');
      this.router.navigate(['/login']);
    }).catch((error) => {
      this.presentToast('Çıkış yaparken bir hata oluştu:'+ error);
    });
  }
}
