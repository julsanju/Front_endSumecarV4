import { Component, OnInit } from '@angular/core';

import { Dashboard } from 'src/app/Interfaces/dashboard';
import { DashboardServicesService } from 'src/app/services/dashboard-services.service';

import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-dashboard',
  //imports:[ModuloDashboardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css', '../../../app/assets/css/sb-admin-2.min.css', '../../assets/vendor/fontawesome-free/css/all.min.css']
})



export class DashboardComponent implements OnInit{

    montados =  0;
    pendientes = 0;
    finalizados = 0; 
  
  constructor(private servicio:DashboardServicesService){}

  ngOnInit() {
    // pedidos montados
    this.servicio.obtenerConfirmados().subscribe(
      (response: Dashboard[]) => {
        if (response && response.length > 0) {
          // Assuming you want the 'cantidad' property of the first Dashboard object
          this.montados = response[0].cantidad;
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

    this.servicio.obtenerPendientes().subscribe(
      (response: Dashboard[]) => {
        if (response && response.length > 0) {
          // Assuming you want the 'cantidad' property of the first Dashboard object
          this.pendientes = response[0].cantidad;
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );

    this.servicio.obtenerFinalizados().subscribe(
      (response: Dashboard[]) => {
        console.log(response)
        if (response && response.length > 0) {
          // Assuming you want the 'cantidad' property of the first Dashboard object
          this.finalizados = response[0].cantidad;
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    
  }

  
}
