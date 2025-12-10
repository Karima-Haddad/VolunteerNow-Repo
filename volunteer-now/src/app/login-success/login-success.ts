import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-success',
  imports: [],
  templateUrl: './login-success.html',
  styleUrl: './login-success.css',
})
export class LoginSuccess implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    //  Récupérer le token depuis l'URL : ?token=...
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      //  Le stocker pour les prochains appels
      localStorage.setItem('token', token);

      // Rediriger vers la page des événements
      this.router.navigate(['/events']);
    } else {
      // Si pas de token → retour au login
      this.router.navigate(['/login']);
    }
  }


}
