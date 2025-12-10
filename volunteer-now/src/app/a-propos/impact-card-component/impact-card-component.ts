import { ChangeDetectorRef, Component, Input, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-impact-card-component',
  imports: [CommonModule],
  templateUrl: './impact-card-component.html',
  styleUrl: './impact-card-component.css',
})
export class ImpactCardComponent implements OnDestroy {

  @Input() icon: string = '';
  @Input() label: string = '';

  private cdr = inject(ChangeDetectorRef);

  private _value: number = 0;

  // ⭐ IMPORTANT : number | string pour autoriser "+100"
  displayValue: number | string = 0;

  private counterInterval?: ReturnType<typeof setInterval>;

  @Input()
  set value(val: number | null | undefined) {
    const realValue = Number(val) || 0;

    
    if (realValue > 100) {
      this._value = 100;
    } else {
      this._value = realValue;
    }

    setTimeout(() => this.startCounter(realValue), 0);
  }

  get value(): number {
    return this._value;
  }

  private startCounter(realValue: number): void {
    this.clearCounter();

    const target = this._value;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    this.displayValue = 0;

    this.counterInterval = setInterval(() => {
      current++;

      this.displayValue = Math.min(Math.floor(increment * current), target);

      this.cdr.detectChanges();

      if (current >= steps) {

       
        if (realValue > 2) {
          this.displayValue = "+100"; 
        } else {
          this.displayValue = realValue;
        }

        this.clearCounter();
      }
    }, duration / steps);
  }

  private clearCounter(): void {
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
      this.counterInterval = undefined;
    }
  }

  ngOnDestroy(): void {
    this.clearCounter();
  }
}
