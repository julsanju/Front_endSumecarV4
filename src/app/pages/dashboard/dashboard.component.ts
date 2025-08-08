import { Component, OnDestroy, OnInit } from '@angular/core';

import { DashboardServicesService } from 'src/app/services/dashboard-services.service';

import { Observable, Subscription, forkJoin, interval } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import * as ApexCharts from 'apexcharts';




@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../../app/assets/css/sb-admin-2.min.css', '../../assets/vendor/fontawesome-free/css/all.min.css']
})


export class DashboardComponent implements OnInit, OnDestroy {

  //rol
  rol = ''
  generalPedidosPendientes = 0;
  private subscription!: Subscription;
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

  constructor(
              private servicio: DashboardServicesService,
              private router: Router, 
      ) { }

      ngOnInit() {
        
        const userDataString = localStorage.getItem('userData');

        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            this.rol = userData.Rol[0].RolId;
      
            // Solo después de tener el rol cargado hacemos las llamadas
            forkJoin([
              this.dataInitNew(),
              this.dataInitNewPeticiones()
            ]).subscribe(() => {
              this.renderizar();
              this.renderizarBarNegativo();
              this.renderizarBottom2();
              this.obtenerPedidoPendiente();
      
              this.subscription = interval(5000).subscribe(() => {
                this.obtenerPedidoPendiente();
              });
              this.renderizarPeticiones();
            });
      
          } catch (error) {
            console.error('Error al analizar JSON:', error);
          }
          this.subscription = interval(5000).subscribe(() => {
            this.obtenerPedidoPendiente();
          });
        }
      }
      

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private initData(movimiento: string, rol: string): Observable<any> {
    return new Observable(observer => {
      this.obtener_usuario().subscribe(usuario => {
        this.dataUser = usuario;
        const dashboardObservable = this.servicio.obtenerDatos(this.dataUser, rol, movimiento);
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
    console.log(this.rol)
    const movimiento = 'pedidos';
    return this.initData(movimiento, this.rol);
  }

  dataInitNewPeticiones(): Observable<any> {
    const movimiento = 'peticiones';
    return this.initData(movimiento, this.rol);
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

  obtenerPedidoPendiente(){
    this.obtener_usuario().subscribe(usuario => {
      this.dataUser = usuario;
          
      if (this.esCliente()) {
        const opcion = 'cliente'
        this.servicio.obtenerPendientes(this.dataUser, opcion).subscribe(data => {
          this.generalPedidosPendientes = data[0].cantidad
        })
      }
      else{
        const opcion = 'otro'
        this.servicio.obtenerPendientes(this.dataUser, opcion).subscribe(data => {
          this.generalPedidosPendientes = data[0].cantidad
        })
      }    
      
          return this.generalPedidosPendientes
      }
    )
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
          color: "#7E3AF2",
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
          const username = userData.Usuario;
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

  //tipo de usuario
  esCliente(): boolean {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        return userData.Rol[0].RolId === '3';
      } catch (error) {
        console.error('Error al aalizar JSON:', error)
        return false;
      }
    }
    return false;
  }
  //REDIRECCIONES
  redireccionarPedidosPendientes(){
    this.router.navigate(['/menu/confirmed-products']).then(() => window.location.reload());
  }
}
