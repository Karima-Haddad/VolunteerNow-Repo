import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpactCardComponent } from "../impact-card-component/impact-card-component";
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-impact-section-component',
  standalone: true,
  imports: [CommonModule, ImpactCardComponent],
  templateUrl: './impact-section-component.html',
  styleUrls: ['./impact-section-component.css'],
})
export class ImpactSectionComponent  {

  stats = [
    { icon: "👥", value: 100, label: "Volontaires actifs" },
    { icon: "🏢", value: 20, label: "Associations partenaires" },
    { icon: "🌍", value: 7, label: "Événements réalisés" },
    { icon: "🏆", value: 15, label: "Badges gagnés" }
  ];

    constructor(
    private statsService: StatsService,
    private cdr: ChangeDetectorRef   
  ) {}

  ngOnInit(): void {
    this.statsService.getImpactStats().subscribe((data) => {
      console.log(" Stats reçues :", data);


      this.stats = [
        { icon: "👥", value: data.volontairesActifs || 0, label: "Volontaires actifs" },
        { icon: "🏢", value: data.associationsPartenaires || 0, label: "Associations partenaires" },
        { icon: "🌍", value: data.evenementsRealises || 0, label: "Événements réalisés" },
        { icon: "🏆", value: data.badgesGagnes || 0, label: "Badges gagnés" }
      ];

      // Forcer la détection 
      this.cdr.detectChanges();
    });

    
  }
  


}
