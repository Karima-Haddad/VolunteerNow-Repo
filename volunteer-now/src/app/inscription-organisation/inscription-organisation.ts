// src/app/inscription-organisation/inscription-organisation.ts
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Footer } from "../shared/footer/footer";
import { ChatbotButton } from "../chatbot/chatbot-button/chatbot-button";
import { RouterLink } from "@angular/router";
import { HeaderInscrit } from "../shared/headers/header-inscrit/header-inscrit";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inscription-organisation',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, ChatbotButton, RouterLink, HeaderInscrit],
  templateUrl: './inscription-organisation.html',
  styleUrls: ['./inscription-organisation.css']
})
export class InscriptionOrganisationComponent {

  submitted = false;
  loading = false;
  photoPreview: string | ArrayBuffer | null = '/assets/img/default-avatar.jpg';
  selectedFile: File | null = null;
  selectedFileName: string | null = null;

  constructor(private authService: AuthService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target!.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      console.log("Formulaire invalide");
      return;
    }

    this.loading = true;

    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('email', form.value.email);
    formData.append('password', form.value.password);
    formData.append('bio', form.value.bio || '');
    formData.append('ville', form.value.ville);
    formData.append('phone', form.value.phone);
    formData.append('role', 'organisation');

    // 🔹 Organisation infos séparées pour correspondre au backend
    formData.append('description', form.value.description || '');
    formData.append('email_contact', form.value.email_contact || '');

    // 🔹 Domaine → categories
    formData.append('categories', form.value.domaine || '');

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.authService.registerOrganization(formData).subscribe({
      next: (res) => {
        console.log("Inscription organisation réussie :", res);
        this.submitted = true;
        this.loading = false;

        this.photoPreview = '/assets/img/default-avatar.jpg';
        this.selectedFile = null;
        this.selectedFileName = '';
        form.resetForm();
      },
      error: (err) => {
        console.error("Erreur inscription organisation :", err);
        alert(err.error?.message || "Erreur lors de la création du compte organisation");
        this.loading = false;
      }
    });
  }

  openChatbot() {
    alert('Besoin d’aide pour inscrire votre organisation ?\nJe vous guide pas à pas !');
  }
}
