import { Component,OnInit, signal } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HeaderCommun } from "../shared/headers/header-commun/header-commun";
import { ChatbotButton } from "../chatbot/chatbot-button/chatbot-button";
import { Footer } from "../shared/footer/footer";
import { RouterLink } from "@angular/router";
import { ProfileApiService, MyProfileResponse } from "../services/profile.service";
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

type BadgeVM = {
  name: string;
  icon: string;
  unlocked: boolean;
};

type EventVM = {
  title: string;
  date: string;
  location: string;
  status: string;
  category: string; // pour la classe event-icon {{ event.category }}
};


@Component({
  selector: 'app-profile-benevole',
  imports: [CommonModule, HeaderCommun, ChatbotButton, Footer, RouterLink],
  templateUrl: './profile-benevole.html',
  styleUrl: './profile-benevole.css',
})


export class ProfileBenevole implements OnInit{

  currentUser: any = null;

  // HERO
  userName = signal<string>('');
  photoUrl = signal<string | null>(null);
  bio = signal<string>('');
  interests = signal<string[]>([]);

  // STATS
  eventsCount = signal<number>(0);   // on va mettre le nb de candidatures
  rating = signal<number>(0);       // note calculée
  badgesCount = signal<number>(0);

  // BADGES + ÉVÉNEMENTS
  badges = signal<BadgeVM[]>([]);
  recentEvents = signal<EventVM[]>([]);

  constructor(
    private route: ActivatedRoute,
    private profileApi: ProfileApiService) {}

  ngOnInit(): void {

    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
        // Affiche le profil d’un autre bénévole
        this.loadBenevoleProfile(id);
      } else {
        // Affiche mon propre profil
        this.loadMyProfile();
      }
  }

  private loadBenevoleProfile(id: string): void {
    this.profileApi.getUserProfile(id).subscribe({
      next: (res) => this.mapProfile(res),
      error: (err) => console.error('Erreur getUserProfile :', err)
    });
  }

  private loadMyProfile(): void {
    this.profileApi.getMyProfile().subscribe({
      next: (res) => this.mapProfile(res),
      error: (err) => console.error('Erreur getMyProfile :', err)
    });
  }

  private mapProfile(res: MyProfileResponse): void {
    if (res.user.role !== 'benevole') {
      // Optionnel : redirection si ce n’est pas un bénévole
      return;
    }

    const user = res.user;

    // Nom + bio
    this.userName.set(user.name);
    this.bio.set(user.bio || '');

    // Photo (adapter le chemin selon ton backend)
    if (user.photo) {
      this.photoUrl.set(`${environment.apiUrl}/uploads/users/${user.photo}`);
    } else {
      this.photoUrl.set(null);
    }

    // Centres d’intérêt (si tu stockes une chaîne "x,y,z")
    const cats = (user.categories || '')
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);
    this.interests.set(cats);

    // Stats
    const totalBadges = res.stats.totalBadges ?? 0;
    const totalCandidatures = res.stats.totalCandidatures ?? 0;

    this.badgesCount.set(totalBadges);
    this.eventsCount.set(totalCandidatures);

    this.rating.set(
      this.computeRating(totalCandidatures, totalBadges)
    );

    // Badges (on considère qu'ils sont tous "unlocked" dans ce contexte)
    const badgesVM: BadgeVM[] = (res.badges || []).map(b => ({
      name: b.badge_id.niveau,
      icon: b.badge_id.icon || '🎖️',
      unlocked: true
    }));
    this.badges.set(badgesVM);

    // Derniers événements = dernières candidatures
    const eventsVM: EventVM[] = (res.lastCandidatures || []).map(c => {
      const ev = c.event_id;
      const date = new Date(ev.date_event).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      return {
        title: ev.titre,
        date,
        location: ev.localisation,
        status: ev.statut || 'Ouvert',
        category: 'default' // adapte si tu veux une vraie catégorie CSS
      };
    });

    this.recentEvents.set(eventsVM);
  }

  // ⭐⭐ Formule de NOTE MOYENNE
  // Participation (max 3 pts) + Badges (max 2 pts) → note sur 5
  private computeRating(totalCandidatures: number, totalBadges: number): number {
    if (totalCandidatures === 0 && totalBadges === 0) return 0;

    const participationScore = Math.min(3, totalCandidatures / 2); // 1 event = 0.5 pt, max 3
    const badgesScore = Math.min(2, totalBadges * 0.5);           // 1 badge = 0.5 pt, max 2
    const note = participationScore + badgesScore;

    return Math.round(note * 10) / 10; // 1 décimale
  }

  // Pour afficher l'initiale si pas de photo
  userInitial(): string {
    const name = this.userName();
    return name ? name.charAt(0).toUpperCase() : 'A';
  }
}

