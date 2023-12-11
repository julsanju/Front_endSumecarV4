
import { Component,  ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule  } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { Usuarios } from '../../Interfaces/usuarios';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Imagen } from 'src/app/Interfaces/imagen';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import { ModuloRegisterModule } from './modulo-register/modulo-register.module';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input'

@Component({
  selector: 'app-register-sales',
  standalone: true,
  imports: [ReactiveFormsModule, 
    RouterModule, 
    HttpClientModule, 
    MatPaginatorModule, 
    MatTableModule, 
    MatProgressBarModule, 
    MatStepperModule, 
    MatSelectModule, 
    MatFormFieldModule,
     MatCheckboxModule, 
     MatSortModule, 
     MatInputModule, 
     MatExpansionModule,
      MatDialogModule, 
      MatGridListModule,
       MatCardModule, 
       RouterOutlet,
       NzLayoutModule,
       NzMenuModule,
       NzBreadCrumbModule,
       NzStepsModule,
       NzSelectModule,
       NzInputModule],
  templateUrl: './register-sales.component.html',
  styleUrls: ['./register-sales.component.css'],
  providers: [
    { provide: NZ_I18N, useValue: en_US }
  ],
})
export class RegisterSalesComponent {
  currentStep:number = 0;
  @ViewChild('fileInput') fileInput: ElementRef;
  datosCompletos: boolean = false;
  isSelectActive: boolean = false;
  registrationForm: FormGroup;
  selectedValue: Usuarios[] | undefined;
  formData = new FormData();
  uploadedImage!: File;
  imagenForm: FormGroup;

  users = [
    {value: 'cliente', viewValue: 'Cliente'}
  ];

  cardStates = {
    card1: true,
    card2: true,
    card3: true
  };

  constructor(private formBuilder: FormBuilder, private registerService: RegisterService) {
    this.fileInput = new ElementRef(null);

    this.imagenForm = this.formBuilder.group({
      imagen: [null] // Este FormControl se asocia con el input de tipo "file"
    });

    this.registrationForm = this.formBuilder.group({
      Identificacion: ['', Validators.required],
      Rol: ['', Validators.required],
      Nombre: ['', Validators.required],
      Ubicacion: ['', Validators.required],
      Telefono: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Usuario: ['', Validators.required],
      Contrasena: ['', Validators.required],

    });
  }

  /*Eventos par el manejo de cards*/
  /*nextStep() {
    if (this.currentStep < 4) { // Cambiar a 4 si hay más pasos
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }*/

  nextStep() {
    if (this.currentStep < 4) { // Cambiar a 4 si hay más pasos
      this.currentStep++;
      this.closeCurrentCard(); // Cierra la card actual
    }
  }
  
  closeCurrentCard() {
    switch (this.currentStep) {
      case 2:
        this.cardStates.card1 = false;
        break;
      case 3:
        this.cardStates.card2 = false;
        break;
      case 4:
        this.cardStates.card3 = false;
        break;
    }
  }

  onSubmit() {
    //if (this.registrationForm.valid) {
      const userData: Usuarios = this.registrationForm.value;

      // Llamada al servicio para registrar al usuario
      this.registerService.registerUser(userData).subscribe(
        response => {
          console.log(response);
          console.log("Registro exitoso");
        },
        error => {
          console.error("Error:", error);
          console.log(error.error)
          console.log("Error en el registro");
        },
        
      );
    //}
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      // Convierte el archivo a un arreglo de bytes (byte[])
      const imageByteArray = new Uint8Array(e.target?.result as ArrayBuffer);

      // Luego, puedes asignar este arreglo de bytes al campo 'imagen' en tu formulario
      this.imagenForm.get('imagen')?.setValue(imageByteArray);
    };

    reader.readAsArrayBuffer(file);
  }
  }
  

  uploadImage() {
    if (this.imagenForm.valid) {
      const formData = new FormData();
      formData.append('imageFile', this.imagenForm.get('imagen')?.value); // Cambia 'FileName' a 'imageFile'
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'multipart/form-data' // Cambia 'image/jpeg' a 'multipart/form-data'
        })
      };
  
      this.registerService.agregarImagen(formData, httpOptions).subscribe(
        (response) => {
          console.log(response);
          console.log("Registro exitoso");
        },
        (error) => {
          console.error("Error:", error);
          console.log(error.error)
          console.log("Error en el registro");
        }
      );
    }
  }

  toggleSelect() {
    this.isSelectActive = !this.isSelectActive;
  }

  //abrir explorador de archivos
  openFileExplorer() {
    this.fileInput.nativeElement.click();
  }
  

  
}

