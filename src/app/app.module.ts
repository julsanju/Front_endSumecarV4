import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { PruebaLoginComponent } from './pages/prueba-login/prueba-login.component';
import { SuccesModalComponent } from './pages/succes-modal/succes-modal.component';
import { ErrorModalComponent } from './pages/error-modal/error-modal.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';




const routes: Routes = [
  {
    path: '',
    component: PruebaLoginComponent
  },
  {
    path: 'prueba-login',
    component: PruebaLoginComponent
  },
  {
    path: 'register',
    component: RegisterSalesComponent
  },
  {
    path: 'cambio-contrasena',
    component: CambiarContrasenaComponent
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
    PruebaLoginComponent,
    SuccesModalComponent,
    ErrorModalComponent
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
    CdkStepperModule,
    FormsModule,
    NgbModule,
    MatStepperModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
