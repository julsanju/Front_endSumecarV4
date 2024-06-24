import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetalleDocumento } from 'src/app/Interfaces/detalle-documento';
import { DocumentosModel } from 'src/app/Interfaces/documentos-model';
import { PdfServicesService } from 'src/app/services/pdf-services.service';

@Component({
  selector: 'app-document-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './document-history.component.html',
  styleUrl: './document-history.component.css'
})
export class DocumentHistoryComponent {
  username:string = ''
  rol:number = 0
  currentPage: number = 1;
  pageSize: number = 4;
  accordeon: { [key: number]: boolean } = {};
  dataSource: DocumentosModel[] = [];
  constructor(private servicioPdf: PdfServicesService){

  }

  ngOnInit(): void{
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        this.username = userData.Usuario;
        this.rol = userData.Rol[0].RolId;
      } catch (error) {
        console.error('Error al analizar JSON:');
      }
    } else {
      console.error('No se encontró userData en localStorage.');
    }  
    this.servicioPdf.mostrar_historial(this.username,this.rol).subscribe(
      (response) => {
        this.dataSource = response
        console.log(response);
      },
      error => {
        console.error('Error obteniendo datos', error);
      }
    );
  }

  abrirCerrarAccordeon(numeroOrden: number) {
    this.accordeon[numeroOrden] = !this.accordeon[numeroOrden];
  }

  getPaginatedData(): DocumentosModel[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.dataSource.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.dataSource.length);
  }
}
