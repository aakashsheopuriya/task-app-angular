import { Component, Inject, LOCALE_ID } from '@angular/core';
import { DataChartComponent } from '../../components/data-chart/data-chart.component';
import { CommonModule } from '@angular/common';
import { ReversePipe } from '../../pipe/reverse.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [DataChartComponent, ReversePipe, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  constructor(@Inject(LOCALE_ID) public locale: string) {}

  Amount = 1300.0;
  name = 'aakash sheopuriya';
  currentTime: any;

  ngOnInit(): void {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
}
