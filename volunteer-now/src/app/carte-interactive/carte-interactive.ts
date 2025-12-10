
import { Component, AfterViewInit } from '@angular/core';
import { Footer } from "../shared/footer/footer";
import { HeaderCommun } from '../shared/headers/header-commun/header-commun';
import * as L from 'leaflet';
import { EventService } from '../services/detailEvent.service';
import { CandidatureService } from '../services/candidature.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-carte-interactive',
  standalone: true,
  imports: [Footer, HeaderCommun],
  templateUrl: './carte-interactive.html',
  styleUrls: ['./carte-interactive.css']
})
export class CarteInteractive implements AfterViewInit {

  userRole: string | null = null;

  private map!: L.Map;
  private userMarker?: L.Marker;

  constructor(
    private eventService: EventService,
    private candidatureService: CandidatureService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadEvents();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.role || null;
  }

  private initMap(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  }

  private loadEvents(): void {
    this.eventService.getEventPositions().subscribe({
      next: (events: any[]) => {
        events.forEach((ev: any) => this.loadStatusAndAddMarker(ev));
      },
      error: () => console.error("Erreur lors du chargement des positions")
    });
  

  
// LOCALISATION UTILISATEUR 
    const redIcon = L.divIcon({
      className: 'custom-location-marker',
      html: `
        <div style="position: relative; width: 40px; height: 40px;">
          <!-- Cercle pulse -->
          <div style="
            position: absolute; top: 0; left: 0;
            width: 40px; height: 40px;
            background: #FFA500; border-radius: 50%;
            opacity: 0.4; animation: pulse 2s infinite;
          "></div>
          
          <!-- Pin central -->
          <div style="
            position: absolute; top: 4px; left: 4px;
            width: 32px; height: 32px;
            background: #FFA500; border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ">
            <span style="
              color: white; font-size: 16px;
              transform: rotate(45deg); font-weight: bold;
            ">📍</span>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    
    this.map.on('locationfound', (e: L.LocationEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Supprimer l'ancien marqueur
      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }

      // Ajouter le marqueur
      this.userMarker = L.marker([lat, lng], { icon: redIcon })
        .addTo(this.map)
        .bindPopup('<b style="color:#FFA500; font-size:1.1rem;">📍 Vous êtes ici !</b><br><span style="color:#0097A7;">Prêt à aider près de chez vous ?</span>')
        .openPopup();

      // Cercle de précision
      L.circle([lat, lng], {
        radius: e.accuracy / 2,
        color: '#0097A7',
        weight: 2,
        opacity: 0.7,
        fillColor: '#0097A7',
        fillOpacity: 0.1
      }).addTo(this.map);
      setTimeout(() => {
    this.removeUserLocation();
  }, 10000);
    });

    this.map.on('locationerror', () => {
      alert('Impossible de vous localiser. Vérifiez les permissions de géolocalisation.');
    });

    // === BOUTON LOCALISATION PERSONNALISÉ ===
    const LocateControl = L.Control.extend({
      options: { position: 'bottomright' },

      onAdd: () => {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        div.innerHTML = `
          <a href="#" title="Me localiser" role="button"
             style="background:#FFA500;color:white;width:40px;height:40px;
                    display:flex;align-items:center;justify-content:center;
                    border-radius:50%;box-shadow:0 3px 10px rgba(255,165,0,0.4);
                    font-size:1.4rem;transition:all 0.2s ease;">📍</a>
        `;

        div.onclick = (event) => {
          L.DomEvent.preventDefault(event);
          this.map.locate({ setView: true, maxZoom: 15 });
        };

        return div;
      }
    });

    this.map.addControl(new LocateControl());
  }

  private removeUserLocation(): void {
  if (this.userMarker) {
    this.map.removeLayer(this.userMarker);
    this.userMarker = undefined;
  }
}

  // -------------------------------------------------------
  //  RÉCUPÈRE LE STATUT PUIS AJOUTE LE MARQUEUR
  // -------------------------------------------------------
  private loadStatusAndAddMarker(event: any): void {
    this.candidatureService.getCandidatureStatus(event._id).subscribe({
      next: (res) => {
        event.candidatureStatus = res.status;   
        this.addEventMarker(event);
      },
      error: (err) => {
        console.error("Erreur statut événement :", err);
        event.candidatureStatus = "none";
        this.addEventMarker(event);
      }
    });
  }

  // -------------------------------------------------------
  //  BOUTON DYNAMIQUE COMME LA PAGE DÉTAIL
  // -------------------------------------------------------
  private getParticiperButton(status: string): string {
  
    if (this.userRole !== 'benevole') {
    return ''; 
  }

  const baseStyle = `
    margin-top: 8px;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.25s ease;
    width: 100%;
    box-shadow: 0 2px 6px rgba(0,0,0,0.18);
  `;

  if (status === 'none') {
    return `
      <button
        style="
          ${baseStyle}
          background: #0097A7;
          color: #ffffff;
        "
      >
        🤝 Participer
      </button>
    `;
  }

  if (status === 'En attente') {
    return `
      <button
        style="
          ${baseStyle}
          background: #808080;
          color: #ffffff;
          cursor: not-allowed;
          opacity: 0.9;
        "
        disabled
      >
        ⏳ Demande en attente
      </button>
    `;
  }

  if (status === 'Acceptée') {
    return `
      <button
        style="
          ${baseStyle}
          background: #22C55E;
          color: #ffffff;
          cursor: not-allowed;
          opacity: 0.9;
        "
        disabled
      >
        ✔ Candidature acceptée
      </button>
    `;
  }

  if (status === 'Refusée') {
    return `
      <button
        style="
          ${baseStyle}
          background: #D32F2F;
          color: #ffffff;
          cursor: not-allowed;
          opacity: 0.9;
        "
        disabled
      >
        ❌ Candidature refusée
      </button>
    `;
  }

  return '';
}


  // -------------------------------------------------------
  //  AJOUTE LE MARQUEUR + POPUP
  // -------------------------------------------------------
  private addEventMarker(event: any): void {
    if (!event.position) return;

    const icon = L.divIcon({
      className: "custom-marker",
      html: `<div style="
        font-size: 32px;
        color:#FF5722;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        animation: bounceIn 0.8s ease-out;
      ">📍</div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    const popupContent = `
      <div style="text-align:center; padding:10px;">

        <h3 style="margin:0 0 6px; color:#FFA500; font-weight:600;">
          ${event.titre}
        </h3>

        <p style="margin:0 0 10px; color:#0097A7;">
          📌 ${event.localisation}
        </p>

        <div id="btn-container-${event._id}">
      ${this.getParticiperButton(event.candidatureStatus)}
    </div>

      </div>
    `;

    const marker = L.marker(
    [event.position.latitude, event.position.longitude],
    { icon }
  ).addTo(this.map);

  marker.bindPopup(popupContent);

  // 🔥 Quand le popup s'ouvre, on ajoute l'action au bouton
  marker.on('popupopen', () => {
    const btn = document.querySelector(`#btn-container-${event._id} button`);
    if (btn && event.candidatureStatus === "none") {
      btn.addEventListener('click', () => {
        this.participer(event._id);
      });
    }
  });
  }


  private participer(eventId: string): void {
  this.candidatureService.participer(eventId).subscribe({
    next: () => {
      this.map.closePopup();
      Swal.fire({
        title: '🤝 Candidature envoyée !',
        text: 'Votre demande de participation a été prise en compte.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#FFA500', // bouton orange thème
        background: '#ffffff',
        color: '#0097A7', // texte bleu thème
        timer: 2500,
        timerProgressBar: true,
      });
      this.loadEvents(); // recharge les statuts sur la carte
    },
    error: (err) => {
      this.map.closePopup();

      Swal.fire({
        title: '❌ Oups !',
        text: err.error?.message || 'Erreur lors de la participation.',
        icon: 'error',
        confirmButtonText: 'Réessayer',
        confirmButtonColor: '#D32F2F',
        background: '#ffffff',
        color: '#0097A7',
      });

      console.error("Erreur participation:", err);
    }
  });
}

}

