// c'est pour le test et le mock de données
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Angular sait que ce service doit être utilisé partout
})
export class ProfileService {

  // DONNÉES DE TEST (MOCK)
  // Tu pourras les remplacer par une API plus tard.
  private organisation = {
    nom: 'EcoVolontaires',
    localisation: 'Tunis',
    description: 'Organisation humanitaire active dans la santé, l’éducation et le social.',
    secteurs: ['Santé', 'Social', 'Éducation'],
    verifie: true,
    membres: ['Nour', 'Karima', 'Mayssa'],
    noteMoyenne: 4.8,
    contactEmail: 'contact@croixrouge.tn',
    logoUrl: null,

    evenementsOrganises: [
      { id: 1, titre: 'Don de sang', date: '2024-05-10', lieu: 'Centre-ville Tunis' },
      { id: 2, titre: 'Nettoyage de plage', date: '2024-06-20', lieu: 'La Marsa' },
      { id: 3, titre: 'Soutien scolaire', date: '2024-04-18', lieu: 'Ariana'}
    ]
  };

  constructor() {}

  // 🔵 Fonction appelée dans ton composant pour récupérer l'organisation
  getOrganisation() {
    return this.organisation;
  }
}
