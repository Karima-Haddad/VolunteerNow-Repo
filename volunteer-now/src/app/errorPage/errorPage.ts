import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './errorPage.html',
  styleUrl: './errorPage.css',
})
export class ErrorPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    
    setTimeout(() => {
      if (token) {
        // un utilisateur connecté
        this.router.navigate(['/events']);
      } else {
        // aucun utilisateur n'est connecté
        this.router.navigate(['/']);
      }
    }, 2000); 

  }
}
