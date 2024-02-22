import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DetallePeticionP } from 'src/app/Interfaces/detalle-peticionP';
import * as ApexCharts from 'apexcharts'
import { DashboardServicesService } from 'src/app/services/dashboard-services.service';
import { Dashboard } from 'src/app/Interfaces/dashboard';
import { Observable, forkJoin, tap } from 'rxjs';

@Component({
  selector: 'app-prueba-layout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prueba-layout.component.html',
  styleUrl: './prueba-layout.component.css'
})

export class PruebaLayoutComponent implements OnInit {
  

  constructor(private servicio: DashboardServicesService) { }


  ngOnInit() {
    this.renderizarAdicional();
  }

  renderizarAdicional() {
    var options = {
        series: [44, 55, 41, 17, 15],
        chart: {
            width: 380,
            type: 'donut',
            startAngle: -90,
            endAngle: 270,
            dropShadow: {
                enabled: true,
                color: '#111',
                top: -1,
                left: 3,
                blur: 3,
                opacity: 0.2
            }
        },
        stroke: {
            width: 0,
        },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: false, // Esto oculta los porcentajes dentro del círculo
                        total: {
                            showAlways: true,
                            show: true
                        }
                    }
                }
            }
        },
        labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
        dataLabels: {
            enabled: false // Esto oculta las etiquetas de datos
        },
        fill: {
            type: 'solid',
        },
        legend: {
            formatter: function(val:number, opts:any) {
                return val + " - " + opts.w.globals.series[opts.seriesIndex]
            }
        },
        title: {
            text: 'Donut Chart with custom Start-angle'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}




}
