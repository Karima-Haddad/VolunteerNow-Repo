import { Component, signal,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderCommun } from "../shared/headers/header-commun/header-commun";
import { Footer } from "../shared/footer/footer";
import { ChatbotButton } from "../chatbot/chatbot-button/chatbot-button"; 
import { RouterLink } from "@angular/router";
import { NotificationService } from '../services/notification.service';
import { ProfileApiService, MyProfileResponse } from '../services/profile.service';
import { environment } from '../../environments/environment';
import { CandidatureService } from '../services/candidature.service';
import Swal from 'sweetalert2';


type EventVM = {
  title: string;
  date: string;
  location: string;
  status: string;
};



@Component({
  selector: 'app-profile-organisation',
  imports: [CommonModule, HeaderCommun, Footer, ChatbotButton, RouterLink
  ],
  standalone: true,
  templateUrl: './profile-organisation.html',
  styleUrls: ['./profile-organisation.css'],
})
export class ProfileOrganisation implements OnInit{
  

  // HERO
  orgName = signal<string>('');
  photoUrl = signal<string | null>(null);
  description = signal<string>('');
  ville = signal<string>('');
  phone = signal<string>('');

  // STATS
  eventsCount = signal<number>(0);
  rating = signal<number>(0);

  // LAST EVENTS
  recentEvents = signal<EventVM[]>([]);

  organisation = signal<any>({
  localisation: '',
  secteurs: [],
  evenementsOrganises: [],
  contactEmail: ''
  });
currentUser: any = null;

ngOnInit() {
  const user = localStorage.getItem('user');
  if (user) {
    this.currentUser = JSON.parse(user);
  }

  const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // ➤ Profil d'une autre organisation
      this.loadOrganisationProfile(id);
    } else {
      // ➤ Mon profil (pour une organisation connectée)
      this.loadMyOrganisationProfile();
    }

    this.chargerNotifications();
}
  notificationsNonLues: any[] = [];
  notifOpen = false;
  
  
  constructor(
    private route: ActivatedRoute,
    private profileApi: ProfileApiService,
    private notificationService: NotificationService,
    private candidatureService: CandidatureService,
    
  ) {}

private loadOrganisationProfile(id: string): void {
  this.profileApi.getUserProfile(id).subscribe({
    next: (res) => this.mapProfile(res),
    error: (err) => console.error("Erreur getUserProfile:", err)
  });
}

private loadMyOrganisationProfile(): void {
  this.profileApi.getMyProfile().subscribe({
    next: (res) => this.mapProfile(res),
    error: (err) => console.error("Erreur getMyProfile:", err)
  });
}



  private mapProfile(res: MyProfileResponse): void {
    if (res.user.role !== "organisation") return;

    const user = res.user;

    // HERO CONTENT
    this.orgName.set(user.name);
    this.description.set(user.organisation_infos?.description || "");
    this.ville.set(user.ville || "");
    this.phone.set(user.phone || "");

    // PHOTO
    if (user.photo) {
      this.photoUrl.set(`${environment.apiUrl}/uploads/users/${user.photo}`);
    } else {
      this.photoUrl.set(null);
    }

    // STATS
    const totalEvents = res.stats.totalEvents ?? 0;
    this.eventsCount.set(totalEvents);

    // NOTE MOYENNE de l'organisation
    this.rating.set(this.computeRating(totalEvents));

    // 3 derniers événements
    const eventsVM: EventVM[] = (res.lastEvents || []).map(ev => {
      const date = new Date(ev.date_event).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      return {
        title: ev.titre,
        date,
        location: ev.localisation,
        status: ev.statut || "Ouvert"
      };
    });

    this.recentEvents.set(eventsVM);

    this.organisation.set({
      localisation: this.ville(),
      secteurs: [],   // tu peux ajouter des secteurs venant du backend ici si tu veux
      evenementsOrganises: this.recentEvents(),
      contactEmail: this.phone()
    });
  }

  // ⭐ Formule NOTE ORGA :
  // Plus elle crée d'événements → meilleure note
  private computeRating(totalEvents: number): number {
    if (totalEvents === 0) return 0;
    if (totalEvents >= 10) return 5;

    // ex: 2 events → 2/10 * 5 = 1
    return Math.round((totalEvents / 10 * 5) * 10) / 10;
  }

  // Initiale si pas de photo
  orgInitial(): string {
    const name = this.orgName();
    return name ? name.charAt(0).toUpperCase() : "O";
  }

  chargerNotifications(): void {
    this.notificationService.getNonTraitees().subscribe({
      next: (res) => {
        this.notificationsNonLues = res.notifications || [];
        console.log("Notifications non lues :", this.notificationsNonLues);
      },
      error: (err) => {
        console.error("Erreur lors du chargement des notifications :", err);
      }
    });
  }

  toggleNotifications() {
    this.notifOpen = !this.notifOpen;
  }


  onAccepter(n: any) {
    this.updateStatus(n.donnees.candidature_id, "acceptee");
  }

  onRefuser(n: any) {
    this.updateStatus(n.donnees.candidature_id, "refusee");
  }

  private updateStatus(candidatureId: string, statut: "acceptee" | "refusee") {

    this.candidatureService.updateStatus(candidatureId, statut).subscribe({
      next: (res) => {

        Swal.fire({
          icon: 'success',
          title: 'Statut mis à jour',
          text: (res as any).message,
          timer: 1500,
          showConfirmButton: false
        });

        // 🔥 Retirer la notification du tableau
        this.notificationsNonLues = this.notificationsNonLues.filter(
          n => n.donnees.candidature_id !== candidatureId
        );
      },

        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.error?.message || 'Une erreur est survenue'
          });
        }
      });
  }


}



