import { Routes } from '@angular/router';

import {MenuComponent} from './pages/menu/menu.component' ;
import {CambiarContrasenaComponent} from './pages/cambiar-contrasena/cambiar-contrasena.component';
import { RegisterSalesComponent } from './pages/register-sales/register-sales.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { VisualizarProductosComponent } from './pages/visualizar-productos/visualizar-productos.component';
import { AddInformationComponent } from './pages/add-information/add-information.component';
import { ConfirmedProductsComponent } from './pages/confirmed-products/confirmed-products.component';
import { FinishedProductsComponent } from './pages/finished-products/finished-products.component';
import { ViewPeticionesComponent } from './pages/view-peticiones/view-peticiones.component';
import { HistorialPeticionesComponent } from './pages/historial-peticiones/historial-peticiones.component';
import { PruebaLoginComponent } from './pages/prueba-login/prueba-login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DialogOverviewComponent } from './pages/dialog-overview/dialog-overview.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/prueba-login' },
    { path: 'menu', component: MenuComponent },
    /*{ path: '', pathMatch: 'full', redirectTo: '/home' },
    { path: 'home', component: HomePharmaComponent },*/
    { path: 'prueba-login', component: PruebaLoginComponent },
    {path: 'dialog', component: DialogOverviewComponent},
    
    {
      path: 'menu',
      component: MenuComponent, // Usa el mismo componente principal para mantener el sidebar
      children: [
        { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, // Redirige a 'register' por defecto en '/menu'
        
        { path : 'dashboard', component: DashboardComponent},
        { path: 'register', component: RegisterSalesComponent }, // Componente RegisterSalesComponent se carga en la vista principal de '/menu'
        { path: 'cambiar-contrasena', component: CambiarContrasenaComponent }, // Componente CambiarContrasenaComponent se carga en la vista principal de '/menu'
        { path: 'productos', component: ProductosComponent },
        { path: 'view-products', component: VisualizarProductosComponent},
        { path: 'add-information', component: AddInformationComponent},
        { path : 'confirmed-products', component : ConfirmedProductsComponent },
        { path : 'finished-products', component : FinishedProductsComponent },
        { path : 'view-peticiones',component : ViewPeticionesComponent},
        {path : 'historial-peticiones',component : HistorialPeticionesComponent},
        
        //{ path: '**', component: Page404Component },
      ],
    },
  ];
