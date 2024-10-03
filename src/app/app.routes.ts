import { Routes } from '@angular/router';

import {MenuComponent} from './pages/menu/menu.component' ;
import { ConfirmedProductsComponent } from './pages/confirmed-products/confirmed-products.component';
import { FinishedProductsComponent } from './pages/finished-products/finished-products.component';
import { ViewPeticionesComponent } from './pages/view-peticiones/view-peticiones.component';
import { HistorialPeticionesComponent } from './pages/historial-peticiones/historial-peticiones.component';
import { PruebaLoginComponent } from './pages/prueba-login/prueba-login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductosSalesComponent } from './pages/productos-sales/productos-sales.component';
import { Page404Component } from './pages/page404/page404.component';
import { CrearUsuarioComponent } from './pages/crear-usuario/crear-usuario.component';

import { LoginAditionalComponent } from './pages/login-aditional/login-aditional.component';
import { EmailConfirmationComponent } from './pages/email-confirmation/email-confirmation.component';
import { DocumentHistoryComponent } from './pages/document-history/document-history.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/prueba-login' },
    { path: 'menu',component: MenuComponent, outlet: 'menu' },
    { path: 'email',component: EmailConfirmationComponent},
    { path: 'prueba-login', component: PruebaLoginComponent },
    { path: 'login-aditional', component: LoginAditionalComponent },
    
    {
      path: 'menu',
      component: MenuComponent,
      children: [
        { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, 
        
        { path : 'dashboard', component: DashboardComponent},
        { path : 'confirmed-products', component : ConfirmedProductsComponent },
        { path : 'finished-products', component : FinishedProductsComponent },
        { path : 'view-peticiones',component : ViewPeticionesComponent},
        {path : 'historial-peticiones',component : HistorialPeticionesComponent},
        {path: 'productos', component: ProductosSalesComponent},
        {path: 'usuarios', component: CrearUsuarioComponent},
        {path: 'documentos', component: DocumentHistoryComponent},
        {path: 'userProfile', component: UserProfileComponent}
      ],
    },
    
    { path: '**', pathMatch : 'full', component: Page404Component},
  ];
