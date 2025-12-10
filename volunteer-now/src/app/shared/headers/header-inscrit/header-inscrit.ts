import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-inscrit',
  imports: [CommonModule, RouterModule],
  templateUrl: './header-inscrit.html',
  styleUrl: './header-inscrit.css',
})
export class HeaderInscrit {
  isMenuOpen = false;

  // Toggle du menu mobile
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Fermeture du menu au clic sur un lien
  closeMenu(): void {
    this.isMenuOpen = false;
  }

}
