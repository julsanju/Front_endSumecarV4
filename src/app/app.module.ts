import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginSalesComponent } from './pages/login-sales/login-sales.component';
import { HeaderSalesComponent } from './shared/header-sales/header-sales.component';
import { FooterSalesComponent } from './shared/footer-sales/footer-sales.component';
import { RegisterSalesComponent } from './pages/register-sales/register-sales.component';
import { RouterModule, Routes } from '@angular/router';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { CambiarContrasenaComponent } from './pages/cambiar-contrasena/cambiar-contrasena.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkStepperComponent } from './components/cdk-stepper/cdk-stepper.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CdkStepperModule} from '@angular/cdk/stepper';



const routes: Routes = [
/*   {
    path: '',
    component: LoginSalesComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }, */
  {
    path: 'register',
    component: RegisterSalesComponent
  },
  {
    path: 'login',
    component: LoginSalesComponent
  }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginSalesComponent,
    HeaderSalesComponent,
    FooterSalesComponent,
    RegisterSalesComponent,
    AjustesComponent,
    CambiarContrasenaComponent,
    DashboardComponent,
    SidebarComponent,
    CdkStepperComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatProgressBarModule,
    NoopAnimationsModule,
    CdkStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
