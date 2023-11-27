
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderSalesComponent } from './shared/header-sales/header-sales.component';
import { FooterSalesComponent } from './shared/footer-sales/footer-sales.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterSalesComponent } from './pages/register-sales/register-sales.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { RouterModule, Routes } from '@angular/router';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { CambiarContrasenaComponent } from './pages/cambiar-contrasena/cambiar-contrasena.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CdkStepperComponent } from './components/cdk-stepper/cdk-stepper.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CdkStepperModule} from '@angular/cdk/stepper';
import { PruebaLoginComponent } from './pages/prueba-login/prueba-login.component';
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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { DialogOverviewComponent } from './pages/dialog-overview/dialog-overview.component';
import { MatDialogModule } from '@angular/material/dialog';
import { VisualizarProductosComponent } from './pages/visualizar-productos/visualizar-productos.component';
import { AddInformationComponent } from './pages/add-information/add-information.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DropdownModule } from 'primeng/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input'
import {MatCardModule} from '@angular/material/card';
import { ConfirmedProductsComponent } from './pages/confirmed-products/confirmed-products.component';
import { FinishedProductsComponent } from './pages/finished-products/finished-products.component';
import { ViewPeticionesComponent } from './pages/view-peticiones/view-peticiones.component';
import { HistorialPeticionesComponent } from './pages/historial-peticiones/historial-peticiones.component';
//import '@dotlottie/player-component'; // Agregar esta importación

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
  },
  {
    path : 'productos',
    component : ProductosComponent
  },
  {
    path : 'view-products',
    component : VisualizarProductosComponent 
  },
  {
    path : 'confirmed-products',
    component : ConfirmedProductsComponent 
  },
  {
    path : 'finished-products',
    component : FinishedProductsComponent 
  },
  {
    path : 'add-information',
    component : AddInformationComponent 
  },
  {
    path : 'view-peticiones',
    component : ViewPeticionesComponent 
  },
  {
    path : 'historial-peticiones',
    component : HistorialPeticionesComponent 
  },
];
@NgModule({
  declarations: [
    AppComponent,
    HeaderSalesComponent,
    FooterSalesComponent,
    DashboardComponent,
    RegisterSalesComponent,
    ProductosComponent,
    AjustesComponent,
    CambiarContrasenaComponent,
    SidebarComponent,
    CdkStepperComponent,
    PruebaLoginComponent,
    ModalMessageComponent,
    DialogOverviewComponent,
    VisualizarProductosComponent,
    MenuComponent,
    NumbersOnlyDirective,
    LocalStorageDirectiveDirective,
    AddInformationComponent,
    ConfirmedProductsComponent,
    FinishedProductsComponent,
    ViewPeticionesComponent,
    HistorialPeticionesComponent

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
    NzMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatExpansionModule,
    MatDialogModule,
    MatGridListModule,
    NzStepsModule,
    NzSelectModule,
    DropdownModule,
    MatCardModule,
    NzInputModule,
       
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
