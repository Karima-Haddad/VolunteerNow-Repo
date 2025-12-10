import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/authentication.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPassword {

  password: string = '';
  confirmPassword: string = '';

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  message: string = '';
  isError: boolean = false;

  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  token: string = '';

  private showMessage() {
  setTimeout(() => this.cdr.detectChanges(), 0);
  }


  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit() {
    this.message = '';
    this.isError = false;

    // Vérifier si les deux mots de passe correspondent
    if (this.password !== this.confirmPassword) {
      this.message = "❌ Les mots de passe ne correspondent pas.";
      this.isError = true;
      this.showMessage();
      return;
    }

    const data = {
      token: this.token,
      password: this.password
    };

    this.authService.resetPassword(data).subscribe({
      next: () => {
        this.message = "✅ Mot de passe modifié avec succès !";
        this.isError = false;
        this.showMessage();

        // Redirection après 1s
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },

      error: (err) => {
        this.message = err.error?.message || "❌ Erreur lors de la réinitialisation.";
        this.isError = true;
        this.showMessage();
      }
    });
  }
}
