import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpactSectionComponent } from "./impact-section-component/impact-section-component";
import { Member } from "./member/member";
import { Footer } from '../shared/footer/footer';
import { ChatbotButton } from "../chatbot/chatbot-button/chatbot-button";
import { RouterLink } from "@angular/router";

export type Teammate = {
  name:string,
  photo:string
}

@Component({
  selector: 'app-a-propos',
  standalone: true,
  imports: [CommonModule, ImpactSectionComponent, Member, Footer, ChatbotButton, RouterLink],
  templateUrl: './a-propos.html',
  styleUrl: './a-propos.css',
})
export class APropos {
  members:Teammate[] =  [{name:'Karima Haddad',photo:"assets/Karima.jpg"},
                        {name:'Mayssa Chikh Ali',photo:"assets/Mayssa.png"},
                        {name:'Nour Khelifi',photo:"assets/Nour.jpg"}
  ];
}
