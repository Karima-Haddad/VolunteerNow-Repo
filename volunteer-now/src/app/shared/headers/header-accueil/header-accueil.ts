import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-accueil',
  imports: [CommonModule, RouterLink],
  templateUrl: './header-accueil.html',
  styleUrls: ['./header-accueil.css'],
})
export class HeaderAccueil {
isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
  
}
