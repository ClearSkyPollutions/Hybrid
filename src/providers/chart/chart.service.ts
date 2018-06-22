import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable()
export class ChartProvider {

  chart   : Chart;
  options : any;
  datasets: any;
  constructor() {
      this.datasets = [{
        duration            : 1000,
        //easing              : 'easeInExpo',
        fill 			    : false
    }];

    this.options = {
        maintainAspectRatio: false,
        legend         : {
          display     : false,
          position: 'bottom',
         },
         scales: {
            yAxes : [{
                ticks            : {
                    display    : false,
                    beginAtZero: false,
                },
                gridLines        : {
                display   : false,
                drawBorder: false
                }
               }],
             xAxes: [{
                 ticks: {
                     display      : false,
                     maxRotation  : 0, // angle in degrees,
                     autoSkip     : true,
                 },
                 gridLines: {
                   display   : false,
                   drawBorder: false
               }
               }]
         }
     };
  }

  public initChart (htmlElement: any) :Chart {
    return this.chart = new Chart(htmlElement.nativeElement,
        {
            type : 'line',
            data : {
                datasets: this.datasets
              },
            options : this.options
        });
    }

  public createLineChart (htmlElement: any, chartLabels: any, chartValues: any, yAxesUnit: string, color: string) :void {
    console.log('generating chart');
    const chart = new Chart(htmlElement,
        {
            type : 'line',
            data : {
                datasets: this.datasets
              },
            options : this.options
    });
    chart.data.labels = chartLabels;
    chart.data.datasets[0].data = chartValues;
    chart.data.datasets[0].borderColor = color;

    chart.update();
    }

  public updateLineChart (htmlElement: any, chartLabels: any, chartValues: any, color: string) :void {
    this.chart.data.labels = chartLabels;
    this.chart.data.datasets[0].data = chartValues;
    this.chart.data.datasets[0].borderColor = color;
    this.chart.options.scales.xAxes[0] = {
        ticks: {
            display      : true,
            maxRotation  : 0, // angle in degrees,
            autoSkip     : true,
        },
        gridLines: {
          display   : false,
          drawBorder: false
      }
    };
    this.chart.update();
  }

}
