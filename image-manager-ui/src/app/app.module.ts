import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Needed for ngModel
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './services/jwt.interceptor';
import { RankingComponent } from './components/ranking/ranking.component';
import { ImageGalleryPageComponent } from './components/image-gallery-page/image-gallery-page.component';


@NgModule({
  declarations: [
    AppComponent,
    ImageGalleryComponent,
    LoginComponent,
    SignupComponent,
    RankingComponent,
    ImageGalleryPageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,         // <-- Important for [(ngModel)]
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
