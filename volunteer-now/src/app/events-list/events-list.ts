import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
import { EventCard } from '../components/event-card/event-card';
import { Footer } from "../shared/footer/footer";
import { HeaderCommun } from '../shared/headers/header-commun/header-commun';
import { ChatbotButton } from "../chatbot/chatbot-button/chatbot-button";

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.html',
  styleUrls: ['./events-list.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    EventCard,
    HeaderCommun,
    Footer,
    ChatbotButton
  ]
})
export class EventsList implements OnInit {

  events: any[] = [];
  loading = true;
  mode: 'public' | 'volunteer' | 'organization'|'private' = 'public';
  currentUser: UserModel | null = null;
  title: string = 'Tous les événements près de chez vous 🌍';
  searchText: string = '';

  // 🔹 PAGINATION
  itemsPerPage = 12;
  currentPage = 1;

  get filteredEvents(): any[] {
    if (!this.searchText) return this.events;
    return this.events.filter(e =>
      e.titre.toLowerCase().includes(this.searchText.toLowerCase()) ||
      e.localisation.toLowerCase().includes(this.searchText.toLowerCase()) ||
      e.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  get paginatedEvents(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEvents.slice(start, end);
  }

  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
  // Ajout des 3 propriétés manquantes pour les flèches
  get totalPages(): number {
    return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
  }

  get pagesArray(): (number | string)[] {
    const totalPages = this.totalPages;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...', totalPages);
      } else if (this.currentPage >= totalPages - 2) {
        pages.push(1, '...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, '...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) pages.push(i);
        pages.push('...', totalPages);
      }
    }
    return pages;
  }

  onSearch() {
    this.currentPage = 1;
  }

  setPage(page: number | string) {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.cdr.detectChanges();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
  // Méthodes pour les flèches ← et →
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.detectChanges();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.detectChanges();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  }
  // ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

   ngOnInit(): void {
    // Récupérer le mode depuis la route (data: { mode: 'private' })
    this.route.data.subscribe(data => {
      this.mode = data['mode'] === 'private' ? 'private' : 'public';
    });

    // Récupérer l'utilisateur connecté depuis localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
    }

    // Charger les événements (sera appelé aussi quand l'URL change)
    this.loadEvents();

    // Réagir si l'URL change (ex: navigation directe vers /user/xxx)
    this.route.paramMap.subscribe(() => {
      this.loadEvents();
    });
  }

  private loadEvents(): void {
    this.loading = true;
    this.currentPage = 1;

    const url = this.router.url.split('?')[0];

    if (url.startsWith('/user/') || this.mode === 'private') {
      // MODE PRIVÉ : /user/:id → on prend l'ID depuis l'URL
      const userIdFromUrl = this.route.snapshot.paramMap.get('id');

      if (!userIdFromUrl) {
        this.loading = false;
        return;
      }

      // On garde le rôle du currentUser (pour le titre)
      this.mode = this.currentUser?.role === 'organisation' ? 'organization' : 'volunteer';
      this.title = "Mes événements";

      this.eventService.getEventsByUser(userIdFromUrl).subscribe({
        next: (events) => {
          this.events = events;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.events = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });

    } else {
      // MODE PUBLIC : /events
      this.mode = 'public';
      this.title = "Tous les événements près de chez vous";

      this.eventService.getAllEvents().subscribe({
        next: (events) => {
          this.events = events;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.events = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
  handleDeleteEvent(event: any) {
    if (!confirm(`Voulez-vous vraiment supprimer l'événement "${event.titre}" ?`)) return;

    this.eventService.deleteEvent(event._id).subscribe({
      next: () => {
        this.events = this.events.filter(e => e._id !== event._id);
        this.cdr.detectChanges();
        alert('Événement supprimé avec succès !');
      },
      error: () => {
        alert('Erreur lors de la suppression de l’événement.');
      }
    });
  }

  handleEditEvent(event: any) {
    const newStatus = prompt(
      `Statut actuel : ${event.statut || 'Ouvert'}\n\nChoisissez le nouveau statut :\n1 → Terminé\n2 → Fermé`,
      '1'
    );

    if (!newStatus) return;

    let statusValue: 'Ouvert' | 'Fermé' | 'Terminé' = 'Terminé';
    if (newStatus.trim() === '2') {
      statusValue = 'Fermé';
    }

    this.eventService.updateEventStatus(event._id, statusValue).subscribe({
      next: (updatedEvent) => {
        event.statut = updatedEvent.statut;
        this.cdr.detectChanges();
        alert(`Statut mis à jour : ${statusValue}`);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la mise à jour du statut.');
      }
    });
  }
}