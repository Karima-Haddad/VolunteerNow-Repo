import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventModel } from '../../models/event.model';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.html',
  styleUrls: ['./event-card.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class EventCard {
  @Input() event!: EventModel;

  // ✅ Propriété pour indiquer si l'utilisateur est une organisation
  @Input() isOrganization: boolean = false;

  // ✅ Événements à émettre vers le parent
  @Output() editEvent = new EventEmitter<EventModel>();
  @Output() deleteEvent = new EventEmitter<EventModel>();

  // ✅ Méthodes pour le template
  onEditEvent(event: EventModel) {
    this.editEvent.emit(event);
  }

  onDeleteEvent(event: EventModel) {
    this.deleteEvent.emit(event);
  }
}
