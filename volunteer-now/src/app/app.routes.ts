import { Routes } from '@angular/router';
import { Accueil } from './accueil/accueil';
import { APropos } from './a-propos/a-propos';
import { CarteInteractive } from './carte-interactive/carte-interactive';
import { EventDetails } from './event-details/event-details';
import { InscriptionBenevoleComponent } from './inscription-benevole/inscription-benevole';
import { InscriptionOrganisationComponent } from './inscription-organisation/inscription-organisation';
import { EventsList } from './events-list/events-list';
import { ProfileBenevole } from './profile-benevole/profile-benevole';
import { AjoutEvenement } from './ajout-evenement/ajout-evenement';
import { ProfileOrganisation } from './profile-organisation/profile-organisation';
import { ForgotPassword } from './forgot-password/forgot-password';
import { ResetPassword } from './reset-password/reset-password';
import { ModifierProfil } from './modifier-profil/modifier-profil';
import { LoginSuccess } from './login-success/login-success';
import { ErrorPage } from './errorPage/errorPage';

export const routes: Routes = [
    { path: '', component: Accueil, title:'VolunteerNOW' },
    { path: 'a-propos', component: APropos, title:'A Propos | VolunteerNOW' },
    { path: 'carte-interactive', component: CarteInteractive, title:'carte-intercative | VolunteerNOW' },
    { path: 'detail-evenement/:id', component: EventDetails, title:'detail-evenement | VolunteerNOW' },
    { path: 'inscription-benevole', component: InscriptionBenevoleComponent, title:'inscription-benevole | VolunteerNOW' },
    { path: 'inscription-oragnisation', component: InscriptionOrganisationComponent, title:'inscription-oragnisation | VolunteerNOW' },
    { path: 'events', component: EventsList, title:'liste-evenements | VolunteerNOW' },  // publique
    { path: 'user/:id', component: EventsList, data: { mode: 'private' }, title: 'Mes événements' },  // utilisateur connecté
    { path: 'Profil-benevole/:id', component: ProfileBenevole, title:'Profil | VolunteerNOW' },
    { path: 'Profil-organisation/:id', component: ProfileOrganisation, title:'Profil | VolunteerNOW' },
    { path: 'ajout-eventement', component: AjoutEvenement, title:'ajout-eventement | VolunteerNOW' },
    { path: 'Mot-de-passe-oublié', component: ForgotPassword, title:'Mot-de-passe-oublié' },
    { path: 'Reinitialiser-mot-de-passe/:token', component: ResetPassword, title:'Réinitialiser-mot-de-passe' },
    { path: 'Modifier-profil', component: ModifierProfil, title:'Modifier-profil' },
    { path: 'login-success', component: LoginSuccess, title: 'Login-Success' },
    { path: '**', component: ErrorPage, title:'Error | VolunteerNOW' },
];
