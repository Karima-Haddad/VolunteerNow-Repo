import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HeaderCommun } from "../shared/headers/header-commun/header-commun";
import { ChatbotButton } from "../chatbot/chatbot-button/chatbot-button";
import { Footer } from "../shared/footer/footer";

import { modifProfile } from '../services/modifProfile.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-modifier-profil',
  imports: [FormsModule, CommonModule, HeaderCommun, ChatbotButton, Footer],
  templateUrl: './modifier-profil.html',
  styleUrl: './modifier-profil.css',
})
export class ModifierProfil {

  private modifProfileService = inject(modifProfile);
  private router = inject(Router);

  user: any = {};          

  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;


  form = {
    name: '',
    email: '',
    phone: '',
    ville: '',
    bio: '',
    oldPassword: '',
    newPassword: ''
  };

  changePassword: boolean = false;
  confirmPassword: string = "";
  userId!: string;

  // Pour la photo
  profilePhoto: File | null = null;
  previewUrl: any = null;

  ngOnInit(): void {
    const storedUser = localStorage.getItem("user");
    


    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log("UTILISATEUR CONNECTÉ :", this.user);   //  debug
      this.userId = this.user.id;

      // Pré-remplir le formulaire
      this.form.name = this.user.name;
      this.form.email = this.user.email;
      this.form.phone = this.user.phone;
      this.form.ville = this.user.ville;
      this.form.bio = this.user.bio;

      // Photo existante si backend la renvoie
      if (this.user.photo) {
        this.previewUrl = this.user.photo;
      }
    }
  }

  onFileSelected(event: any) {
    this.profilePhoto = event.target.files[0];
    if (!this.profilePhoto) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(this.profilePhoto);
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const char = event.key;

    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }


  onCancel(event: Event) {
    event.preventDefault();

    Swal.fire({
      title: 'Quitter la modification ?',
      text: 'Les changements non enregistrés seront perdus.',
      icon: 'warning',
      iconColor: '#FFA500',                   
      showCancelButton: true,
      confirmButtonText: 'Oui, quitter',
      cancelButtonText: 'Non, continuer',
      reverseButtons: true,
      heightAuto: false,

      confirmButtonColor: '#FFA500',            
      cancelButtonColor: '#0097A7',             

      customClass: {
        popup: 'vn-swal-popup',
        title: 'vn-swal-title',
        htmlContainer: 'vn-swal-text',
        confirmButton: 'vn-swal-confirm-btn',
        cancelButton: 'vn-swal-cancel-btn'
      },

      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.border = '3px solid #FFA500';
          popup.style.borderRadius = '16px';
          popup.style.boxShadow = '0 10px 30px rgba(255, 165, 0, 0.25)';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {

    const userStr = localStorage.getItem('user');

    if (!userStr) {
      console.warn("⚠ Aucun utilisateur dans localStorage. Redirection sécurisée.");
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(userStr);

    if (!user.role) {
      console.warn("⚠ L'utilisateur n'a pas de rôle. Redirection sécurisée.");
      this.router.navigate(['/login']);
      return;
    }
        if (user.role === 'benevole') {
          this.router.navigate(['/Profil-benevole', this.userId]);
        } else if (user.role === 'organisation') {
          this.router.navigate(['/Profil-organisation', this.userId]);
        }
      }
    });
  }


  onSubmit() {

    // Si changement de mot de passe → vérifier la confirmation
    if (this.user.authProvider === "local") {
      if (!this.form.oldPassword) {
        alert("Veuillez entrer votre mot de passe actuel.");
        return;
      }

      if (this.changePassword && this.form.newPassword !== this.confirmPassword) {
        alert("Les mots de passe ne correspondent pas.");
        return;
      }
    }

    // Préparer le FormData
    const data = new FormData();

    data.append("name", this.form.name);
    data.append("email", this.form.email);
    data.append("phone", this.form.phone);
    data.append("ville", this.form.ville);
    data.append("bio", this.form.bio);

    // Ancien mot de passe obligatoire en cas d'auth local
    if (this.user.authProvider === "local") {
      if (this.form.oldPassword) {
        data.append("oldPassword", this.form.oldPassword);
      }

      if (this.changePassword && this.form.newPassword) {
        data.append("newPassword", this.form.newPassword);
      }
    }


    // Photo si modifiée
    if (this.profilePhoto) {
      data.append("photo", this.profilePhoto);
    }


    // Envoi au backend
    this.modifProfileService.updateProfile(this.userId, data)
      .subscribe({
        next: (res: any) => {
          Swal.fire({
            title: 'Profil mis à jour 🎉',
            text: 'Vos informations ont été modifiées avec succès.',
            icon: 'success',
            confirmButtonText: 'Super !',
            background: '#ffffff',
            confirmButtonColor: '#0097A7',
            color: '#333',
            iconColor: '#FFA500',
            timer: 2500,
            timerProgressBar: true
          });


          /** Mettre à jour localStorage avec les nouvelles infos */
          const updatedUser = {
            ...this.user,
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            ville: this.form.ville,
            bio: this.form.bio,
            photo: res.user?.photo || this.user.photo,
            authProvider: this.user.authProvider
          };

          localStorage.setItem("user", JSON.stringify(updatedUser));

          const role = updatedUser.role;
          const id = this.userId;

          if (role === 'organisation') {
            this.router.navigate([`/Profil-organisation/${id}`]);
          } else {
            this.router.navigate([`/Profil-benevole/${id}`]);
          }

        },
        error: (err) =>  {
          Swal.fire({
            title: 'Erreur ❌',
            text: err.error?.message || "Erreur serveur.",
            icon: 'error',
            confirmButtonColor: '#FFA500',
            background: '#fff',
            color: '#333'
          });
        }
      });
  }

}

