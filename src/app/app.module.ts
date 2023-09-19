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
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterSalesComponent } from './pages/register-sales/register-sales.component';
import { RouterModule, Routes } from '@angular/router';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { CambiarContrasenaComponent } from './pages/cambiar-contrasena/cambiar-contrasena.component';
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
import { ModalMessageComponent } from './pages/modal-message/modal-message.component';
import { MenuComponent } from './pages/menu/menu.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { IconsProviderModule } from './icons-provider.module';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb'; // Importa el módulo de migas de pan
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { LocalStorageDirectiveDirective } from './directives/local-storage-directive.directive'

registerLocaleData(en); // Importa el módulo de layout
const routes: Routes = [
  {
    path: '',
    redirectTo: '/prueba-login', // Redirige a la página de inicio de sesión
    pathMatch: 'full',
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
  },
  {
    path: 'menu',
    component: MenuComponent
  },
  {
    path : 'dashboard',
    component : DashboardComponent
  }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginSalesComponent,
    HeaderSalesComponent,
    FooterSalesComponent,
    DashboardComponent,
    RegisterSalesComponent,
    AjustesComponent,
    CambiarContrasenaComponent,
    SidebarComponent,
    CdkStepperComponent,
    PruebaLoginComponent,
    SuccesModalComponent,
    ErrorModalComponent,
    ModalMessageComponent,
    MenuComponent,
    NumbersOnlyDirective,
    LocalStorageDirectiveDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    MatProgressBarModule,
    NoopAnimationsModule,
    CdkStepperModule,
    FormsModule,
    NgbModule,
    MatStepperModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    IconsProviderModule,
    NzMenuModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
