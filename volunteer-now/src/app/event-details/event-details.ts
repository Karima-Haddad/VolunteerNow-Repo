import { Component,OnInit } from '@angular/core';
import { HeaderCommun } from '../shared/headers/header-commun/header-commun';
import { DatePipe, NgStyle } from '@angular/common';
import { Footer } from '../shared/footer/footer';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/detailEvent.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { CandidatureService } from '../services/candidature.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-details',
  imports: [HeaderCommun,Footer, DatePipe, NgStyle, CommonModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css',
})
export class EventDetails implements OnInit {
  userRole: string | null = null;

  event: any;
  eventId!: string;
  candidatureStatus: string = "none";



  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private candidatureService: CandidatureService,
    private router: Router,
    private cdr : ChangeDetectorRef
  ) {};


  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.role || null;

    const id = this.route.snapshot.paramMap.get('id');
    console.log("ID reçu depuis l’URL =", id);    //debug
    this.eventId = id!;


    //Récuperer les details d'un évènement
    this.eventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        console.log("📌 Détails événement :", data);

        data.date_event = new Date(data.date_event);
        this.event = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.candidatureService.getCandidatureStatus(this.eventId).subscribe({
      next: (res) => {
        this.candidatureStatus = res.status;
        this.cdr.markForCheck();},
      error: () => this.candidatureStatus = 'none'
    });
  }

    voirProfil(id: string) {
      console.log("ID envoyé :", id);

      this.router.navigate(['/Profil-organisation', id]);
    }


    formatImageUrl(photo: string | undefined): string {
      if (!photo) return 'assets/default.png';

      // Si déjà une URL complète
      if (photo.startsWith('http')) return photo;

      // Si la photo ne contient pas "uploads" → c'est juste un nom de fichier
      // Ex : "default-user.png"
      return `http://localhost:3000/uploads/users/${photo}`;
    }




  participer() {
  this.candidatureService.participer(this.eventId).subscribe({
    next: () => {
      this.candidatureStatus = 'En attente';
      this.cdr.detectChanges();

      // Alert personnalisée
      Swal.fire({
        title: 'Candidature envoyée !',
        text: 'Votre demande a été transmise à l’organisateur.',
        icon: 'success',
        confirmButtonColor: '#0097A7'
      });
    },

    error: (err) => {
      Swal.fire({
        title: 'Erreur',
        text: err.error?.message || 'Impossible d’envoyer votre candidature.',
        icon: 'error',
        confirmButtonColor: '#D32F2F'
      });
    }
  });
}



}
