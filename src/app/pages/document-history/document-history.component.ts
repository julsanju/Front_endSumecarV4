import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetalleDocumento } from 'src/app/Interfaces/detalle-documento';
import { DocumentosModel } from 'src/app/Interfaces/documentos-model';
import { PdfServicesService } from 'src/app/services/pdf-services.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProductsServicesService } from 'src/app/services/products-services.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-document-history',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PdfViewerModule],
  templateUrl: './document-history.component.html',
  styleUrl: './document-history.component.css'
})
export class DocumentHistoryComponent {
  username:string = ''
  rol:number = 0
  estadoPdf:boolean = false;
  currentPage: number = 1;
  pageSize: number = 4;
  accordeon: { [key: number]: boolean } = {};
  dataSource: DocumentosModel[] = [];
  constructor(private servicioPdf: PdfServicesService, private servicioHistory: ProductsServicesService){

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
    // this.servicioPdf.mostrar_historial(this.username,this.rol).subscribe(
    //   (response) => {
    //     this.dataSource = response
    //     console.log(response);
    //   },
    //   error => {
    //     console.error('Error obteniendo datos', error);
    //   }
    // );

    this.obtenerDatoshistorial().subscribe(
      (response) => {
        console.log('Datos obtenidos:', response);
        this.dataSource = response
      },
      (error) => {
        console.error('Error obteniendo datos:', error);
      }
    );
  }

  obtenerDatoshistorial(): Observable<any> {
    return new Observable((observer) => {
      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          const username = userData.Usuario;
          const rol = userData.Rol[0].RolId;
          this.servicioHistory.SeteoDatosHistorialDocumentos(username, rol).subscribe(
            (response) => {
              observer.next(response);
              observer.complete();
            },
            (error) => {
              observer.error('Error obteniendo datos del servicio: ' + error);
            }
          );
        } catch (error) {
          observer.error('Error al analizar JSON: ' + error);
        }
      } else {
        observer.error('No se encontró userData en localStorage.');
      }
    });
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

  mostrarViewPdf(numeroOrden: number){
    this.estadoPdf = true;
    console.log("numerodeorden"+numeroOrden)
  }
  closeViewPdf(){
    this.estadoPdf = false;
  }
}
