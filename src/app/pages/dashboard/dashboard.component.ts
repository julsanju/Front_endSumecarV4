import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Dashboard } from 'src/app/Interfaces/dashboard';
import { DashboardServicesService } from 'src/app/services/dashboard-services.service';
import * as ApexCharts from 'apexcharts';
import { MenuComponent } from '../menu/menu.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../../app/assets/css/sb-admin-2.min.css', '../../assets/vendor/fontawesome-free/css/all.min.css']
})


export class DashboardComponent implements OnInit {
  montados = 0;
  pendientes = 0;
  finalizados = 0;
  /*chartjs*/
  fecha1 = 0;
  mes1 = 0;
  cantidad1 = 0;

  fecha2 = 0;
  mes2 = 0;
  cantidad2 = 0;

  fecha3 = 0;
  mes3 = 0;
  cantidad3 = 0;

  fecha4 = 0;
  mes4 = 0;
  cantidad4 = 0;

  fecha5 = 0;
  mes5 = 0;
  cantidad5 = 0;

  informe1 = 0;
  dataUser = '';

  //condicional
  crecimiento1: boolean = false;
  crecimiento2: boolean = false;

  constructor(private servicio: DashboardServicesService) {}
  

  ngOnInit() {
    // pedidos montados
    this.dataInitNew()
    this.dataInitNew().subscribe(() => {
      // Cuando todas las llamadas a los servicios se completen, renderizar
      this.renderizar();
    });
    
  }
  
  dataInitNew(): Observable<any> {
    this.obtener_usuario().subscribe(
      (usuario) => {
        this.dataUser = usuario;
      })

    const estado = 'pendiente';
    const movimiento = 'pedidos';
    const dashboardObservable = this.servicio.obtenerDatos(this.dataUser, estado, movimiento);

    return new Observable(observer => {
      forkJoin([dashboardObservable]).subscribe(
        ([data]) => { // Corregir el tipo de datos recibido


          // Reiniciar las cantidades
          this.cantidad1 = 0;
          this.cantidad2 = 0;
          this.cantidad3 = 0;
          this.cantidad4 = 0;
          this.cantidad5 = 0;
          // Iterar sobre los datos y asignar las cantidades a las variables correspondientes
          data.forEach((item, index) => {
            if (index === 0) {
              this.cantidad1 = item.cantidad;
              this.fecha1 = item.anio;
              this.mes1 = item.mes;
              this.informe1 = item.informe1;
              //validacion para colores en el html
              // Validar si informe1 es negativo
              if (this.informe1 > 0) {
                this.crecimiento1 = true;
              }
              
            } else if (index === 1) {
              this.cantidad2 = item.cantidad;
              this.fecha2 = item.anio;
              this.mes2 = item.mes;
            } else if (index === 2) {
              this.cantidad3 = item.cantidad;
              this.fecha3 = item.anio;
              this.mes3 = item.mes;
            }else if (index === 3) {
              this.cantidad4 = item.cantidad;
              this.fecha4 = item.anio;
              this.mes4 = item.mes;
            }
            else if (index === 4) {
              this.cantidad5 = item.cantidad;
              this.fecha5 = item.anio;
              this.mes5 = item.mes;
            }

          });

          observer.next({
            cantidad1: this.cantidad1,
            cantidad2: this.cantidad2,
            cantidad3: this.cantidad3,
            cantidad4: this.cantidad4,
            cantidad5: this.cantidad5,
            informe1: this.informe1
          });
          observer.complete();
        },
        error => {
          console.error('Hubo un error al obtener los datos:', error);
          observer.error(error);
        }
      );

    });


  }

  renderizar() {
    const options = {
      chart: {
        height: "60%",
        maxWidth: "20%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.55,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 6,
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 2,
          right: 2,
          top: 0
        },
      },
      series: [
        {
          name: "Pedidos",
          data: [this.cantidad1, this.cantidad2, this.cantidad3, this.cantidad4,  this.cantidad5],
          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: [this.fecha1 + " " + this.mes1, this.fecha2 + " " + this.mes2, this.fecha3 + " " + this.mes3,this.fecha3 + " " + this.fecha4 + " " + this.mes4 + this.fecha5 + " " + this.mes5],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
      
    }

    if (document.getElementById("montados-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("montados-chart"), options);
      chart.render();
    }
  }

  
  //metodo para convertir el valor negativo a valor positivo
  convertirValorPositivo(numero: number): number {
    return Math.abs(numero);
  }

  private obtener_usuario(): Observable<string> {
    return new Observable((observer) => {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const username = userData.usuario;
          observer.next(username);
          observer.complete();
        } catch (error) {
          observer.error('Error al analizar JSON:');
        }
      } else {
        observer.error('No se encontró userData en localStorage.');
      }
    });
  }
  
}
