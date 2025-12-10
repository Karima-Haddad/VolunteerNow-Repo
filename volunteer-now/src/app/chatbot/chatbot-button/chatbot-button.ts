

import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';// ➤ adapte le chemin selon ton projet
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-chatbot-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot-button.html',
  styleUrls: ['./chatbot-button.css']
})
export class ChatbotButton {

  @ViewChild('chatBody') chatBody!: ElementRef;

  isChatOpen = false;
  userInput = "";
  isLoading = false;

  messages = [
    { sender: "bot", text: "Bonjour 👋 Je suis le chatbot VolunteerNow. Comment puis-je vous aider ?" }
  ];

  constructor(
  private chatbotService: ChatbotService,
  private cdr: ChangeDetectorRef,
  private zone: NgZone
) {}

  // Ouvre/ferme le panneau du chatbot
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;

    // Quand on ouvre → on scrolle automatiquement
    if (this.isChatOpen) {
      setTimeout(() => this.scrollToBottom(), 150);
    }
  }

  // Envoi d’un message
  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = this.userInput.trim();

    // Afficher le message de l’utilisateur
    this.messages.push({ sender: "user", text: userMsg });
    this.userInput = "";
    this.isLoading = true;
    this.cdr.detectChanges();
    this.scrollToBottom();

    // 🌟 Appel à ton backend + IA OpenAI
    this.chatbotService.sendMessage(userMsg).subscribe({
      next: (response) => {
        this.zone.run(() => {
          this.messages.push({
            sender: "bot",
            text: response.reply
          });

          this.isLoading = false;
          this.cdr.detectChanges();
          this.scrollToBottom();
        });
      },

      error: (err) => {
        console.error("Erreur chatbot :", err);

        this.messages.push({
          sender: "bot",
          text: "Oups 😕 une erreur est survenue. Réessaie plus tard."
        });

        this.isLoading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  // 📌 Fonction qui scrolle automatiquement vers le bas
  scrollToBottom() {
    try {
      const element = this.chatBody.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) {
      console.warn("Erreur scroll :", err);
    }
  }
}
