import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header-commun',
  imports: [RouterModule],
  templateUrl: './header-commun.html',
  styleUrl: './header-commun.css',
})
export class HeaderCommun implements OnInit {

  user:any = null;

    constructor(private router: Router) {};
    
    ngOnInit() {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    }

    goToProfile() {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      if (user.role === "benevole") {
        this.router.navigate(['/Profil-benevole',user.id]);
      } 
      else if (user.role === "organisation") {
        this.router.navigate(['/Profil-organisation',user.id]);
      }
    }

    logout(){

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      this.router.navigate(['/']);
    }

}
