import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule} from '@angular/fire/compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth/';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';

import { environment } from 'src/environments/environment';
registerLocaleData(localeTr);

@NgModule({
  declarations: [AppComponent,],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,AngularFireModule.initializeApp(environment.firebase),ReactiveFormsModule,AngularFireAuthModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },{ provide: LOCALE_ID, useValue: 'tr-TR' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
