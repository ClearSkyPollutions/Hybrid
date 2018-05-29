import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';

@Injectable()
export class ChartProvider {

  chart: Chart;
  constructor() {}


  public createLineChart (htmlElement: any, chartLabels: any, chartValues: any, yAxesUnit: string, color: string){
    return this.chart = new Chart(htmlElement.nativeElement,
        {
            type : 'line',
            data : {
                labels: chartLabels,
                datasets: [{
                    data                : chartValues,
                    label               : yAxesUnit,
                    duration            : 1000,
                    easing              : 'easeInQuart',
                    borderColor         : color,
                    //backgroundColor   : '#36a2eb',
                    hoverBackgroundColor: '',
                    fill 			            : false
                }]
              },
            options : {
                maintainAspectRatio: false,
               legend         : {
                 display     : true,
                 position: 'bottom',
                },
                scales: {
                    yAxes : [{
                        scaleLabel: {
                            labelString: yAxesUnit
                        } ,            
                        ticks            : {
                            display    : false,
                            beginAtZero: false,
                            //stepSize : 5,
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
                            maxTicksLimit: 4
                        },
                        gridLines: {
                          display   : false,
                          drawBorder: false
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
