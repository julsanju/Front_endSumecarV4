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
  // Variables para pedidos
  pedidosMontados = 0;
  pedidosPendientes = 0;
  pedidosFinalizados = 0;
  fechaPedido1 = 0;
  mesPedido1 = 0;
  cantidadPedido1 = 0;
  fechaPedido2 = 0;
  mesPedido2 = 0;
  cantidadPedido2 = 0;
  fechaPedido3 = 0;
  mesPedido3 = 0;
  cantidadPedido3 = 0;
  fechaPedido4 = 0;
  mesPedido4 = 0;
  cantidadPedido4 = 0;
  fechaPedido5 = 0;
  mesPedido5 = 0;
  cantidadPedido5 = 0;
  fechaPedido6 = 0;
  mesPedido6 = 0;
  cantidadPedido6 = 0;
  informePedido1 = 0;
  crecimientoPedido1: boolean = false;
  crecimientoPedido2: boolean = false;

  // Variables para peticiones
  peticionesMontadas = 0;
  peticionesPendientes = 0;
  peticionesFinalizadas = 0;
  fechaPeticion1 = 0;
  mesPeticion1 = 0;
  cantidadPeticion1 = 0;

  fechaPeticion2 = 0;
  mesPeticion2 = 0;
  cantidadPeticion2 = 0;
  
  fechaPeticion3 = 0;
  mesPeticion3 = 0;
  cantidadPeticion3 = 0;
  
  fechaPeticion4 = 0;
  mesPeticion4 = 0;
  cantidadPeticion4 = 0;
  
  fechaPeticion5 = 0;
  mesPeticion5 = 0;
  cantidadPeticion5 = 0;
  
  fechaPeticion6 = 0;
  mesPeticion6 = 0;
  cantidadPeticion6 = 0;

  informePeticion1 = 0;
  crecimientoPeticion1: boolean = false;
  crecimientoPeticion2: boolean = false;
  dataUser = '';

  constructor(private servicio: DashboardServicesService) { }

  ngOnInit() {
    // pedidos montados
    this.dataInitNew().subscribe(() => {
      this.renderizar();
      this.renderizarBarNegativo();
      this.renderizarBottom();
      this.renderizarBottom2();
    });

    // peticiones montadas
    this.dataInitNewPeticiones().subscribe(() => {
      this.renderizarPeticiones();
    });
  }

  private initData(movimiento: string, estado: string): Observable<any> {
    return new Observable(observer => {
      this.obtener_usuario().subscribe(usuario => {
        this.dataUser = usuario;
        const dashboardObservable = this.servicio.obtenerDatos(this.dataUser, estado, movimiento);
        forkJoin([dashboardObservable]).subscribe(
          ([data]) => {
            if (movimiento === 'pedidos') {
              this.assignPedidoData(data);
            } else if (movimiento === 'peticiones') {
              this.assignPeticionData(data);
            }
            observer.next();
            observer.complete();
          },
          error => {
            console.error('Hubo un error al obtener los datos:', error);
            observer.error(error);
          }
        );
      });
    });
  }

  private assignPeticionData(data: any): void {
    // Asignar datos de peticiones a las variables correspondientes
    data.forEach((item: any, index: number) => {
      if (index === 0) {
        this.peticionesMontadas = item.resultado;
        this.fechaPeticion1 = item.anio;
        this.mesPeticion1 = item.mes;
        this.cantidadPeticion1 = item.cantidad;
        this.informePeticion1 = item.informe1;
        if (this.informePeticion1 > 0) {
          this.crecimientoPeticion1 = true;
        }
      } else if (index === 1) {
        this.fechaPeticion2 = item.anio;
        this.mesPeticion2 = item.mes;
        this.cantidadPeticion2 = item.cantidad;
      } else if (index === 2) {
        this.fechaPeticion3 = item.anio;
        this.mesPeticion3 = item.mes;
        this.cantidadPeticion3 = item.cantidad;
      } else if (index === 3) {
        this.fechaPeticion4 = item.anio;
        this.mesPeticion4 = item.mes;
        this.cantidadPeticion4 = item.cantidad;
      } else if (index === 4) {
        this.fechaPeticion5 = item.anio;
        this.mesPeticion5 = item.mes;
        this.cantidadPeticion5 = item.cantidad;
      } else if (index === 5) {
        this.fechaPeticion6 = item.anio;
        this.mesPeticion6 = item.mes;
        this.cantidadPeticion6 = item.cantidad;
      }
    });
  }

  private assignPedidoData(data: any): void {
    // Asignar datos de pedidos a las variables correspondientes
    data.forEach((item: any, index: number) => {
      if (index === 0) {
        this.pedidosMontados = item.resultado;
        this.fechaPedido1 = item.anio;
        this.mesPedido1 = item.mes;
        this.cantidadPedido1 = item.cantidad;
        this.informePedido1 = item.informe1;
        if (this.informePedido1 > 0) {
          this.crecimientoPedido1 = true;
        }
      } else if (index === 1) {
        this.fechaPedido2 = item.anio;
        this.mesPedido2 = item.mes;
        this.cantidadPedido2 = item.cantidad;
      } else if (index === 2) {
        this.fechaPedido3 = item.anio;
        this.mesPedido3 = item.mes;
        this.cantidadPedido3 = item.cantidad;
      } else if (index === 3) {
        this.fechaPedido4 = item.anio;
        this.mesPedido4 = item.mes;
        this.cantidadPedido4 = item.cantidad;
      } else if (index === 4) {
        this.fechaPedido5 = item.anio;
        this.mesPedido5 = item.mes;
        this.cantidadPedido5 = item.cantidad;
      } else if (index === 5) {
        this.fechaPedido6 = item.anio;
        this.mesPedido6 = item.mes;
        this.cantidadPedido6 = item.cantidad;
      }

    });
  }

  dataInitNew(): Observable<any> {
    const estado = 'pendiente';
    const movimiento = 'pedidos';
    return this.initData(movimiento, estado);
  }

  dataInitNewPeticiones(): Observable<any> {
    const estado = 'pendiente';
    const movimiento = 'peticiones';
    return this.initData(movimiento, estado);
  }


  //renderizado para graficas
  //otros graficos
  renderizarBarNegativo() {
    var options = {
      series: [42, 47, 52,],
      chart: {
        width: 380,
        type: 'polarArea'
      },
      labels: ['Rose A', 'Rose B', 'Rose C'],
      fill: {
        opacity: 1
      },
      stroke: {
        width: 1,
        colors: undefined
      },
      yaxis: {
        show: false
      },
      legend: {
        position: 'bottom'
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 0
          },
          spokes: {
            strokeWidth: 0
          },
        }
      },
      theme: {
        monochrome: {
          enabled: true,
          shadeTo: 'light',
          shadeIntensity: 0.6
        }
      }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  }
  //pedidos
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
          data: [this.cantidadPedido1, this.cantidadPedido2, this.cantidadPedido3, this.cantidadPedido4, this.cantidadPedido5, this.cantidadPedido6],
          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: [this.fechaPedido1 + " " + this.mesPedido1, this.fechaPedido2 + " " + this.mesPedido2, this.fechaPedido3 + " " + this.mesPedido3, this.fechaPedido4 + " " + this.mesPedido4, this.fechaPedido5 + " " + this.mesPedido5, this.fechaPedido6 + " " + this.mesPedido6],
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
  //informacion adicional de pedidos
  renderizarAdicionales() {
    this.renderizarAdicionalPedidos4();
    this.renderizarAdicionalPedidos();
    this.renderizarAdicionalPedidos2();

  }

  renderizarAdicionalPedidos() {
    var options = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: '100%', // Cambiar el ancho del gráfico para que se ajuste al contenedor
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
              show: true,
              total: {
                showAlways: false,
                show: true
              }
            }
          }
        }
      },
      labels: ["Comedy", "Action", "SciFi", "Drama", "Horror"],
      dataLabels: {

        enabled: false

      },
      fill: {
        type: 'solid',
      },
      legend: {
        position: 'right', // Cambiar la posición de la leyenda a la derecha
        formatter: function (val: number, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex]
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: '100%' // Ajustar el ancho del gráfico para dispositivos de menor tamaño
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    var chart = new ApexCharts(document.querySelector("#informacionAdicionalPedidos"), options);
    chart.render();
  }

  renderizarAdicionalPedidos2() {
    var options = {
      series: [{
        name: 'Series 1',
        data: [80, 50, 30, 40, 100, 20],
      }],
      chart: {
        height: 350,
        type: 'radar',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June']
      }
    };

    var chart = new ApexCharts(document.querySelector("#informacionAdicionalPedidos2"), options);
    chart.render();
  }

  
  renderizarAdicionalPedidos4() {
    var options = {
      series: [{
        name: "Session Duration",
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
      },
      {
        name: "Page Views",
        data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
      },
      {
        name: 'Total Visits',
        data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
      }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: {
        text: 'Page Statistics',
        align: 'left'
      },
      legend: {
        tooltipHoverFormatter: function (val: any, opts: any) {
          return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
          '10 Jan', '11 Jan', '12 Jan'
        ],
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val: any) {
                return val + " (mins)"
              }
            }
          },
          {
            title: {
              formatter: function (val: any) {
                return val + " per session"
              }
            }
          },
          {
            title: {
              formatter: function (val: any) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    };

    var chart = new ApexCharts(document.querySelector("#renderizarAdicionalPedidos4"), options);
    chart.render();
  }

  //peticiones
  renderizarPeticiones() {
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
          name: "Peticiones",
          data: [this.cantidadPeticion1, this.cantidadPeticion2, this.cantidadPeticion3, this.cantidadPeticion4, this.cantidadPeticion5, this.cantidadPeticion6],
          color: "#1A56DB",
        },
      ],
      xaxis: {
        categories: [this.fechaPeticion1 + " " + this.mesPeticion1, this.fechaPeticion2 + " " + this.mesPeticion2, this.fechaPeticion3 + " " + this.mesPeticion3,  + this.fechaPeticion4 + " " + this.mesPeticion4, this.fechaPeticion5 + " " + this.mesPeticion5, this.fechaPeticion6 + " " + this.mesPeticion6],
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

    if (document.getElementById("peticiones-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("peticiones-chart"), options);
      chart.render();
    }
  }

  //renderizado general parte bottom
  renderizarBottom() {
    const getChartOptions = () => {
      return {
        series: [90, 85, 70],
        colors: ["#1C64F2", "#16BDCA", "#FDBA8C"],
        chart: {
          height: "380px",
          width: "100%",
          type: "radialBar",
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          radialBar: {
            track: {
              background: '#E5E7EB',
            },
            dataLabels: {
              show: false,
            },
            hollow: {
              margin: 0,
              size: "32%",
            }
          },
        },
        grid: {
          show: false,
          strokeDashArray: 4,
          padding: {
            left: 2,
            right: 2,
            top: -23,
            bottom: -20,
          },
        },
        labels: ["Done", "In progress", "To do"],
        legend: {
          show: true,
          position: "bottom",
          fontFamily: "Inter, sans-serif",
        },
        tooltip: {
          enabled: true,
          x: {
            show: false,
          },
        },
        yaxis: {
          show: false,
          labels: {
            formatter: function (value: number) {
              return value + '%';
            }
          }
        }
      }
    }

    if (document.getElementById("radial-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.querySelector("#radial-chart"), getChartOptions());
      chart.render();
    }
  }
  renderizarBottom2() {

    const options = {
      // enable and customize data labels using the following example, learn more from here: https://apexcharts.com/docs/datalabels/
      dataLabels: {
        enabled: true,
        // offsetX: 10,
        style: {
          cssClass: 'text-xs text-white font-medium'
        },
      },
      grid: {
        show: false,
        strokeDashArray: 4,
        padding: {
          left: 16,
          right: 16,
          top: -26
        },
      },
      series: [
        {
          name: "PEDIDOS",
          data: [this.cantidadPedido1, this.cantidadPedido2, this.cantidadPedido3, this.cantidadPedido4, this.cantidadPedido5, this.cantidadPedido6],
          color: "#1A56DB",
        },
        {
          name: "PETICIONES",
          data: [this.cantidadPeticion1, this.cantidadPeticion2, this.cantidadPeticion3, this.cantidadPeticion4, this.cantidadPeticion5, this.cantidadPeticion6],
          color: "#7E3BF2",
        },
      ],
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
      legend: {
        show: true
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
      stroke: {
        width: 6,
      },
      xaxis: {
        categories: [this.fechaPeticion1 + " " + this.mesPeticion1, this.fechaPeticion2 + " " + this.mesPeticion2, this.fechaPeticion3 + " " + this.mesPeticion3,  + this.fechaPeticion4 + " " + this.mesPeticion4, this.fechaPeticion5 + " " + this.mesPeticion5, this.fechaPeticion6 + " " + this.mesPeticion6],
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
        labels: {
          show: false
        }
      },
    }

    if (document.getElementById("data-labels-chart") && typeof ApexCharts !== 'undefined') {
      const chart = new ApexCharts(document.getElementById("data-labels-chart"), options);
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
