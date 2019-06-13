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
      fill 			    : false,
      label: "PMS1_0 ug/m3",
      lineTension: 1,
      backgroundColor: "rgba(75,80,192,0.4)",
      borderColor: "rgba(75,192,12,1)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "rgba(75,192,192,100)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 5,
      pointHoverRadius: 10,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 5,
      pointRadius: 1,
      pointHitRadius: 10,
      spanGaps: true,
      
  }];
    this.options = {
        plugins: {
            datalabels: {
                display: true,
                borderRadius: 4,
                color: 'white',
                font: {
                    weight: 'bold'
                },
                formatter: Math.round
            }
        },
        maintainAspectRatio: true,
        legend         : {
          display     : false,
          position: 'bottom',
         },
         scales: {
            yAxes : [{
                ticks            : {
                    display    : true,
                    beginAtZero: false,
                },
                gridLines        : {
                display   : true,
                drawBorder:true
                }
               }],
             xAxes: [{
                 ticks: {
                     display      : true,
                     maxRotation  : 0, // angle in degrees,
                     autoSkip     : true,
                 },
                 gridLines: {
                   display   : true,
                   drawBorder: true
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
    console.log(chartValues);
    const chart = new Chart(htmlElement,
        {
          type : 'line',
          data : {
              datasets: this.datasets
            },
          options : this.options
    });
    chart.data.labels = chartLabels;
    //chart.data.datasets[0].data = chartValues;
    chart.data.datasets[0].borderColor = color;

    //chart.update();
    }

  public updateLineChart (htmlElement: any, chartLabels: any, chartValues: any, color: string) :void {
    this.chart.data.labels = chartLabels;
    this.chart.data.datasets[0].data = chartValues;
   // console.log('this.chart.data.datasets[0].data: ', this.chart.data.datasets[0].data);
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
