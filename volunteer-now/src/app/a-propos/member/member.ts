import { Component, Input } from '@angular/core';
import { Teammate } from '../a-propos';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member {
  @Input() member!:Teammate;
}
