// src/app/models/event.model.ts
export interface EventModel {
  _id: string;                   // correspond à MongoDB
  titre: string;                 // titre de l'événement
  date_event: string;             // date
  localisation: string;           // ville/localisation
  description: string;
  imageUrl?: string;
  participantsIds?: string[];
  organizationId?: string;
  public?: boolean;
  statut?: 'Ouvert' | 'Fermé' | 'Terminé';  // <- utilisé par le backend
}
