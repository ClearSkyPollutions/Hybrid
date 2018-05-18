import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable()
export class ChartProvider {


  constructor() {}



  public createLineChart (htmlElement: any, chartLabels: any, chartValues: any){
    return new Chart(htmlElement.nativeElement,
      {
          type: 'line',
          data: {
            labels: chartLabels,
            datasets: [{
                label                 : '',
                data                  : chartValues,
                duration              : 1000,
                easing                : 'easeInQuart',
                backgroundColor       : '#36a2eb',
                hoverBackgroundColor  : '',
                fill 				   : false
            }]
          },
          options : {
            maintainAspectRatio: false,
            legend         : {
                display     : false,
                boxWidth    : 80,
                fontSize    : 15,
                padding     : 0
            },
            scales: {
                yAxes: [{
                  ticks: {
                      beginAtZero:true,
                      stepSize: 2,
                      //max : 100
                  }
                }],
                xAxes: [{
                  ticks: {
                      autoSkip: true,
                      maxTicksLimit: 3
                  }
                }]
            }
          }
      });
      }

  public createBarChart(htmlElement: any, chartLabels: any, chartValues: any){
    return new Chart(htmlElement.nativeElement,
      {
         type: 'bar',
         data: {
            labels: chartLabels,
            datasets: [{
               label                 : 'Air Quality bar chart',
               data                  : chartValues,
               duration              : 2000,
               easing                : 'easeInQuart',
               backgroundColor       : '#36a2eb',
               hoverBackgroundColor  : '#ffce56'
            }]
         },
         options : {
            maintainAspectRatio: false,
            legend         : {
               display     : false,
               boxWidth    : 80,
               fontSize    : 15,
               padding     : 0
            },
            //showXLabels: 2,
            scales: {
               yAxes: [{
                  ticks: {
                     beginAtZero: true,
                     stepSize: 5,
                     //max : 100
                  }
               }],
               xAxes: [{
                  ticks: {
                     autoSkip:true,
                     maxTicksLimit: 3
                  }
               }]
            }
         }
      });
  }
}
