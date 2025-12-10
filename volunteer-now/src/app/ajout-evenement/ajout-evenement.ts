import { Component, OnInit, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { HeaderCommun } from "../shared/headers/header-commun/header-commun";
import { Footer } from "../shared/footer/footer";
import { ChatbotButton } from "../chatbot/chatbot-button/chatbot-button";
import { RouterLink } from '@angular/router';
import { EventService } from '../services/evenement.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-ajout-evenement',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderCommun, Footer, ChatbotButton, RouterLink],
  templateUrl: './ajout-evenement.html',
  styleUrls: ['./ajout-evenement.css'],
})
export class AjoutEvenement implements OnInit, AfterViewInit {

  form = signal({
    titre: '',
    description: '',
    date_event: '',
    localisation: '',
    ville: '',
    categorie: '',
    nb_places: 0,
    statut: 'ouvert',
    latitude: null as number | null,
    longitude: null as number | null
  });

  private map!: L.Map;
  private marker: L.Marker | null = null;

  constructor(private eventService: EventService,private router: Router ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  // -------------------------------
  // INITIALISATION DE LA CARTE
  // -------------------------------
  initMap(): void {
    const defaultLat = 36.8;
    const defaultLng = 10.17;

    // Initialiser la carte
    this.map = L.map('map').setView([defaultLat, defaultLng], 12);

    // Charger la tuile OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    // Ajouter un marker simple au clic
    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Supprimer l'ancien marker
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // Nouvel emplacement du marker
      this.marker = L.marker([lat, lng]).addTo(this.map);

      // Mettre à jour position dans le formulaire
      this.form.update(f => ({
        ...f,
        latitude: lat,
        longitude: lng
      }));
    });
  }

  // -------------------------------
  // ENVOI DU FORMULAIRE
  // -------------------------------
onSubmit() {
  const value = this.form();

  if (!value.latitude || !value.longitude) {
    alert("Veuillez choisir un emplacement sur la carte !");
    return;
  }

  // Récupérer l'utilisateur connecté
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    alert("Vous devez être connecté pour créer un événement");
    this.router.navigate(['/']);
    return;
  }

  const user = JSON.parse(userJson);

  const payload = {
    titre: value.titre,
    description: value.description,
    date_event: value.date_event,
    localisation: `${value.ville} - ${value.localisation}`,
    categorie: value.categorie,
    nb_places: value.nb_places,
    latitude: value.latitude,
    longitude: value.longitude,
    organisation_id: user.id  // ← ENVOYÉ ICI
  };

  console.log("DATA ENVOYÉE :", payload);

  this.eventService.createEvent(payload).subscribe({
    next: (res) => {
      Swal.fire('Succès', 'Événement créé !', 'success').then(() => {
        this.router.navigate(['/user', user.id]);
      });
    },
    error: (err) => {
      console.error(err);
      alert("Erreur lors de la création");
    }
  });
}


  cancel() {
    window.history.back();
  }
}
