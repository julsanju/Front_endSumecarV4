import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { CambiarContrasenaComponent } from './pages/cambiar-contrasena/cambiar-contrasena.component';

const routes: Routes = [
  {path: 'ajustes', component: AjustesComponent},
  {path: 'changepassword', component: CambiarContrasenaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
