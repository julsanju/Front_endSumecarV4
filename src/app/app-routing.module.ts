import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PruebaLoginComponent } from './pages/prueba-login/prueba-login.component';
import {MenuComponent} from './pages/menu/menu.component' ;
import {CambiarContrasenaComponent} from './pages/cambiar-contrasena/cambiar-contrasena.component';
import { RegisterSalesComponent } from './pages/register-sales/register-sales.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/prueba-login' },
  { path: 'prueba-login', component: PruebaLoginComponent },
  
  {
    path: 'menu',
    component: MenuComponent, // Usa el mismo componente principal para mantener el sidebar
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, // Redirige a 'register' por defecto en '/menu'
      { path : 'dashboard', component: DashboardComponent},
      { path: 'register', component: RegisterSalesComponent }, // Componente RegisterSalesComponent se carga en la vista principal de '/menu'
      { path: 'cambiar-contrasena', component: CambiarContrasenaComponent }, // Componente CambiarContrasenaComponent se carga en la vista principal de '/menu'
    ],
  },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
