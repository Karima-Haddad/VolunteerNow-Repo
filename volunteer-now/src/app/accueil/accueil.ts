import { Component,inject } from '@angular/core';
import { HeaderAccueil } from '../shared/headers/header-accueil/header-accueil';
import { Footer } from "../shared/footer/footer";
import { ChatbotButton } from "../chatbot/chatbot-button/chatbot-button";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-accueil',
  imports: [HeaderAccueil, Footer, ChatbotButton, CommonModule, FormsModule],
  templateUrl: './accueil.html',
  styleUrls: ['./accueil.css'],
})
export class Accueil {

  email:string = "";
  password:string = "";
  errorMessage:string = "";
  isLoading:boolean = false;

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    const data = {
    email: this.email,
    password: this.password
  };

  this.authService.login(data).subscribe({
    next: (res)=>{
      this.isLoading = false;
      if(res.token){
        localStorage.setItem('token',res.token);
      }
      if (res.user){
        localStorage.setItem('user',JSON.stringify(res.user))
      }

    

      console.log('Connexion réussie !');
      this.router.navigate(['/events']);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
      this.cdr.detectChanges();
    }
    })

  }

  loginWithGoogle() {
  window.location.href = "http://localhost:3000/authgoogle/google";
}


}
