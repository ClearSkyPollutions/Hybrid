import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable()
export class ChartProvider {

  chart: Chart;
  constructor() {}


  public initChart (htmlElement: any){
    return this.chart = new Chart(htmlElement.nativeElement,
        {
            type : 'line',
            data : {
                datasets: [{
                    label               : '',
                    duration            : 1000,
                    easing              : 'easeInQuart',
                    borderColor         : '#36a2eb',
                    //backgroundColor     : '#36a2eb',
                    hoverBackgroundColor: '',
                    fill 			    : false
                }]
              },
            options : {
                maintainAspectRatio: false,
               legend         : {
                 display     : false
                },
                scales: {
                    yAxes              : [{
                        scaleLabel     : {
                              display    : true
                          },                
                        ticks            : {
                            beginAtZero  : false,
                            //stepSize     : 5,
                        }, 
                        gridLines        : {
                          display        : false
                      }
                      }],
                      xAxes: [{
                        scaleLabel     : {
                              display    : true
                          },
                        ticks: {
                            maxRotation: 0, // angle in degrees,
                            autoSkip: true,
                            maxTicksLimit: 4
                        },
                        gridLines: {
                          display:false
                      }
                      }]
                }
            }
        });
    }
  
  public updateLineChart (chartLabels: any, chartValues: any, yAxesUnit: string){

    this.chart.data.labels= chartLabels;
    this.chart.data.datasets[0].data= chartValues;
    this.chart.options.scales.yAxes[0].scaleLabel.labelString= yAxesUnit;
  
    this.chart.update();
  }

 
}
