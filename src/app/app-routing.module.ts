import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PruebaLoginComponent } from './pages/prueba-login/prueba-login.component';
import {MenuComponent} from './pages/menu/menu.component' ;
import {CambiarContrasenaComponent} from './pages/cambiar-contrasena/cambiar-contrasena.component';
import { RegisterSalesComponent } from './pages/register-sales/register-sales.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { VisualizarProductosComponent } from './pages/visualizar-productos/visualizar-productos.component';
import { AddInformationComponent } from './pages/add-information/add-information.component';
import { MensajesPendientesComponent } from './pages/mensajes-pendientes/mensajes-pendientes.component';
import { HistorialMensajesComponent } from './pages/historial-mensajes/historial-mensajes.component';
import { ConfirmedProductsComponent } from './pages/confirmed-products/confirmed-products.component';
import { FinishedProductsComponent } from './pages/finished-products/finished-products.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { HomePharmaComponent } from './pages/home-pharma/home-pharma.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'menu', component: MenuComponent },
  /*{ path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomePharmaComponent },*/
  {path: 'home', component: HomePharmaComponent },
  
  {
    path: 'menu',
    component: MenuComponent, // Usa el mismo componente principal para mantener el sidebar
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, // Redirige a 'register' por defecto en '/menu'
      { path: 'prueba-login', component: PruebaLoginComponent },
      { path : 'dashboard', component: DashboardComponent},
      { path: 'register', component: RegisterSalesComponent }, // Componente RegisterSalesComponent se carga en la vista principal de '/menu'
      { path: 'cambiar-contrasena', component: CambiarContrasenaComponent }, // Componente CambiarContrasenaComponent se carga en la vista principal de '/menu'
      { path: 'productos', component: ProductosComponent },
      { path: 'view-products', component: VisualizarProductosComponent},
      { path: 'add-information', component: AddInformationComponent},
      { path: 'add-information', component: AddInformationComponent},
      { path: 'add-information', component: AddInformationComponent},
      { path : 'mensajes-pendientes', component : MensajesPendientesComponent },
      { path : 'historial-mensajes', component : HistorialMensajesComponent },
      { path : 'confirmed-products', component : ConfirmedProductsComponent },
      { path : 'finished-products', component : FinishedProductsComponent },
      { path : 'userList', component : UserListComponent },
      
    ],
  },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
