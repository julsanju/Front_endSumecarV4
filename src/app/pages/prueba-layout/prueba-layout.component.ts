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
  fecha1 = 0;
  mes1 = 0;
  cantidad1 = 0;

  fecha2 = 0;
  mes2 = 0;
  cantidad2 = 0;

  fecha3 = 0;
  mes3 = 0;
  cantidad3 = 0;

  informe1 = 0;
  informe2 = 0;
  dataUser = '';

  //condicional
  crecimiento1: boolean = false;
  crecimiento2: boolean = false;

  constructor(private servicio: DashboardServicesService) { }


  ngOnInit() {
    this.dataInitNew()
    this.dataInitNew().subscribe(() => {
      // Cuando todas las llamadas a los servicios se completen, renderizar
      this.renderizar();
    });

    console.log(this.fecha1)
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


          // Iterar sobre los datos y asignar las cantidades a las variables correspondientes
          data.forEach((item, index) => {
            if (index === 0) {
              this.cantidad1 = item.cantidad;
              this.fecha1 = item.anio;
              this.mes1 = item.mes;
              this.informe1 = item.informe1;
              this.informe2 = item.informe2;
              //validacion para colores en el html
              // Validar si informe1 es negativo
              if (this.informe1 > 0) {
                this.crecimiento1 = true;
              }
              // Validar si informe2 es negativo
              if (this.informe2 > 0) {
                this.crecimiento2 = true;
              }
            } else if (index === 1) {
              this.cantidad2 = item.cantidad;
              this.fecha2 = item.anio;
              this.mes2 = item.mes;
            } else if (index === 2) {
              this.cantidad3 = item.cantidad;
              this.fecha3 = item.anio;
              this.mes3 = item.mes;
            }

          });

          observer.next({
            cantidad1: this.cantidad1,
            cantidad2: this.cantidad2,
            cantidad3: this.cantidad3,
            informe1: this.informe1,
            informe2: this.informe2
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
        height: "100%",
        maxWidth: "100%",
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
          data: [this.cantidad1, this.cantidad2, this.cantidad3],
          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: [this.fecha1 + " " + this.mes1, this.fecha2 + " " + this.mes2, this.fecha3 + " " + this.mes3],
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
