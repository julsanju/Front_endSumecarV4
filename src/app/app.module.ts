import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginSalesComponent } from './pages/login-sales/login-sales.component';
import { HeaderSalesComponent } from './shared/header-sales/header-sales.component';
import { FooterSalesComponent } from './shared/footer-sales/footer-sales.component';
import { RegisterSalesComponent } from './pages/register-sales/register-sales.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LoginSalesComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
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
    RegisterSalesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
