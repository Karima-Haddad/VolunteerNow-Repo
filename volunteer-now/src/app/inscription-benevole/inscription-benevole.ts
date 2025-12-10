// src/app/inscription-benevole/inscription-benevole.ts
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Footer } from "../shared/footer/footer";
import { ChatbotButton } from '../chatbot/chatbot-button/chatbot-button';
import { RouterLink } from "@angular/router";
import { HeaderInscrit } from "../shared/headers/header-inscrit/header-inscrit";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-inscription-benevole',
  standalone: true,
  imports: [CommonModule, FormsModule, Footer, ChatbotButton, RouterLink, HeaderInscrit],
  templateUrl: './inscription-benevole.html',
  styleUrls: ['./inscription-benevole.css']
})
export class InscriptionBenevoleComponent {

  submitted = false;
  loading = false;

  // Variables pour la photo de profil
  photoPreview: string | null = 'http://localhost:3000/uploads/users/default-avatar.jpg';
  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(private authService: AuthService) {}

  countInterets(form: NgForm): number {
    const keys = ['ecologie', 'solidarite', 'education', 'sante', 'culture', 'sport'];
    return keys.filter(k => form.value[k]).length;
  }

  isFormValid(form: NgForm): boolean {
    const requiredFields = ['nom', 'email', 'password', 'localisation', 'phone'];
    const allFilled = requiredFields.every(f => form.value[f] && form.controls[f]?.valid);
    return allFilled && this.countInterets(form) >= 2;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file: File = input.files[0];

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('L’image ne doit pas dépasser 5 Mo');
      return;
    }

    this.selectedFile = file;
    this.selectedFileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(form: NgForm) {
    if (!this.isFormValid(form)) {
      console.log("Formulaire invalide ou moins de 2 centres d’intérêt");
      return;
    }

    this.loading = true;

    const categoriesArray: string[] = [];
    const interests = ['ecologie', 'solidarite', 'education', 'sante', 'culture', 'sport'];
    interests.forEach(key => {
      if (form.value[key]) categoriesArray.push(key);
    });

    const formData = new FormData();
    formData.append('name', form.value.nom); // correspond au backend
    formData.append('email', form.value.email);
    formData.append('password', form.value.password);
    formData.append('bio', form.value.bio || '');
    formData.append('ville', form.value.localisation);
    formData.append('phone', form.value.phone);
    formData.append('role', 'benevole');
    formData.append('categories', categoriesArray.join(','));

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile, this.selectedFile.name);
    }

    this.authService.registerVolunteer(formData).subscribe({
      next: (res) => {
        console.log("Inscription bénévole réussie :", res);
        this.submitted = true;
        this.loading = false;

        this.photoPreview = 'http://localhost:3000/uploads/users/default-avatar.jpg';
        this.selectedFile = null;
        this.selectedFileName = '';
        form.resetForm();
      },
      error: (err) => {
        console.error("Erreur inscription :", err);
        alert(err.error?.message || "Erreur lors de la création du compte");
        this.loading = false;
      }
    });
  }

  openChatbot() {
    alert('Besoin d’aide ?\nJe suis là pour vous guider !');
  }
}
