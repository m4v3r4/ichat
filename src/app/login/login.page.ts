import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string="";
  password: string="";
  error: string="";

 
  constructor(private authService: AuthService,private router: Router,private toastController:ToastController) { }
 ionViewWillEnter() {
    this.authService.isLoggedIn();
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        // Giriş başarılı
        this.presentToast('Giriş yapıldı');
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        
        this.presentToast('Giriş başarısız:'+error);
        
        this.error = error.message.toString();
      });
  }
  register() {
    this.router.navigate(['/register']);
  }
}