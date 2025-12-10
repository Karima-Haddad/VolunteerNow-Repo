import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AuthService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {

  email: string = '';
  errorMessage:string = "";
  successMessage:string = "";

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  private showMessage() {
  setTimeout(() => this.cdr.detectChanges(), 0);
}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (res)=>{

        this.successMessage = "Vérifier votre boite mail";
        this.errorMessage = "";
        this.showMessage();

        console.log('Connexion réussie !');
    },
    error: (err) => {
        this.errorMessage = err.error?.message || "Insérez un mail valide";
        this.successMessage = "";
        this.showMessage();
    }
    })
  }
}
