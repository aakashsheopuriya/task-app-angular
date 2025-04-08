import { Component, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { ApiService } from '../../services/api.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-data-chart',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.css'],
})
export class DataChartComponent {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: any;
  constructor(public service: ApiService) {}
  monthList: string[] = [];
  monthData: any;

  ngOnInit() {
    this.monthList = [];
    this.service.onGetAllTask().subscribe((res: any) => {
      for (let a = 0; a < res.data.length; a++) {
        this.monthList.push(res.data[a].startdate.split('-')[1]);
      }
      this.monthData = this.countOccurrences(this.monthList);

      let data = this.monthData;

      // ----------- chart

      this.chartOptions = {
        series: [
          {
            name: 'Total numbers of Tasks',
            data: Array.from(
              { length: 12 },
              (_, i) => this.monthData[String(i + 1).padStart(2, '0')] || 0
            ),

            // data: [
            //   this.monthData['01'] || 0,
            //   this.monthData['02'] || 0,
            //   this.monthData['03'] || 0,
            //   this.monthData['04'] || 0,
            //   this.monthData['05'] || 0,
            //   this.monthData['06'] || 0,
            //   this.monthData['07'] || 0,
            //   this.monthData['08'] || 0,
            //   this.monthData['09'] || 0,
            //   this.monthData['10'] || 0,
            //   this.monthData['11'] || 0,
            //   this.monthData['12'] || 0,
            // ],
          },
        ],
        chart: {
          type: 'bar',
          height: 400,
          toolbar: {
            show: false,
          },
        },
        colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
        plotOptions: { bar: { columnWidth: '60%', distributed: true } },
        dataLabels: { enabled: false },
        legend: { show: false },
        grid: { show: true },
        xaxis: {
          categories: [
            'Jan',
            'Fab',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
        },
      };
    });
  }

  public countOccurrences(arr: any) {
    return arr.reduce((acc: any, ele: any) => {
      acc[ele] = (acc[ele] || 0) + 1;
      return acc;
    }, {});
  }
}
