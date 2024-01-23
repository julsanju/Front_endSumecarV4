import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Productos } from 'src/app/Interfaces/productos';
import { DataProductsService } from 'src/app/services/data-products.service';
import { ProductsServicesService } from 'src/app/services/products-services.service';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { Router } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { MatDialog } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos-sales',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NzModalModule],
  templateUrl: './productos-sales.component.html',
  styleUrl: './productos-sales.component.css'
})
export class ProductosSalesComponent implements OnInit {

  displayedColumns: string[] = ['codigo', 'articulo', 'laboratorio'];
  dataSource: Productos[] = [];
  originalDataSource: Productos[] = [];
  selectedRow: any;
  clickedRows = new Set<Productos>();
  cantidadForm: FormGroup;
  cantidadValue !: number;
  producto_seleccionado: Productos[] = [];
  productoActual: Productos | null = null;
  //modal
  showAlert: boolean = false;
  anchoBarra: number = 0;
  assignedQuantity!: number;
  showModal: boolean = false;
  //paginacion
  pageSize: number = 8;
  currentPage: number = 1;
  //sweet Alert
  spinner: boolean = false;
  username = '';
  errorMessage: MensajeError | null = null;
  //dawner
  estadoBotones: boolean = false;

  constructor(private dataServices: DataProductsService,
    private servicio: ProductsServicesService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog) {

    this.cantidadForm = this.formBuilder.group({
      cantidad: ['', Validators.required]
    });

    this.cantidadForm.get('cantidad')!.valueChanges.subscribe(value => {
      if (this.productoActual) {
        // Actualiza la cantidad del producto actual
        this.productoActual.cantidad = value;
      }
    });

  }

  ngOnInit(): void {
    // Llamada al servicio para obtener los datos

    this.servicio.obtenerProductos().subscribe(
      (response) => {
        this.dataSource = response;
        this.originalDataSource = response;
      },
      error => {
        console.error('Error obteniendo datos', error);
      }
    );


  }

  //filtro de productos
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.dataSource = this.originalDataSource.filter(producto =>
      producto.codigo.toLowerCase().includes(filterValue) ||
      producto.articulo.toLowerCase().includes(filterValue) ||
      producto.laboratorio.toLowerCase().includes(filterValue)
    );
  }

  productoSeleccionado(producto: Productos) {
    // Crea una copia del producto
    this.productoActual = Object.assign({}, producto);
    this.producto_seleccionado.push(this.productoActual);

    this.cantidadForm.reset();
  }
  
  mostrarModal() {
    this.showModal = true;
  }

  cerrar_modal() {
    this.showModal = false;
    // Otras acciones que necesitas realizar al cancelar la selección
  }

  cancelarSeleccion() {
    // Verifica si productoActual no es null
    if (this.productoActual) {
      // Encuentra el índice del producto actual en el array
      const index = this.producto_seleccionado.indexOf(this.productoActual);

      // Si el producto actual está en el array, lo elimina
      if (index > -1) {
        this.producto_seleccionado.splice(index, 1);
      }
    }

    // Resetea el producto actual
    this.productoActual = null;
  }


  mostrarAlerta() {
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 1000);

  }


  //confirmar productos
  confirmar() {
    const userDataString = localStorage.getItem('userData');

    this.spinner = true;
    if (userDataString) {
      try {
        // Intenta analizar la cadena como JSON
        const userData = JSON.parse(userDataString);
        this.username = userData.usuario; // Actualiza la propiedad 'username' con el valor correcto

      } catch (error) {
        // En caso de un error al analizar JSON, puedes manejarlo o simplemente retornar false
        console.error('Error al analizar JSON:', error);
      }
    }


    this.servicio.confirmarProductos(this.producto_seleccionado, this.username).subscribe(
      response => {
        console.log(response);
        this.spinner = false;

        Swal.fire('Su producto ha sido confirmado exitosamente!', '', 'success');

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito
        
        this.generatePDF();
        this.generarExcel()

        //asignar tiempo para borrar los datos seleccionados
        setTimeout(() => {
          this.producto_seleccionado = [];
        }, 7000);
      },
      error => {
        console.error("Error:", error);
        console.log(error.error)
        this.spinner = false;

        this.errorMessage = error.Message; // Accede al campo "Message" del JSON de error
        console.log(this.errorMessage);

        Swal.fire({
          title: 'ERROR',
          html: `${this.errorMessage}`,
          icon: 'error',
        });
        console.log("Error en el registro");
      },

    );
    this.estadoBotones = true;
  }

  //pagina para refrescar la pagina
  refrescar() {
    // Esperar 2 segundos (ajusta el tiempo según tus necesidades)
    const tiempoEspera = 1000; // en milisegundos (2 segundos en este ejemplo)

    setTimeout(() => {
      // Recargar la página después del tiempo de espera
      location.reload();
    }, tiempoEspera);
  }
  /*generateTableHTML() {
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
      // Obtén el contenido HTML de la tabla
      const tableHTML = tableContainer.innerHTML;
      return tableHTML;
    }
    return '';
  }*/

  //animacion para alerta
  objectALertClasses(opacity_0: boolean, opacity_100: boolean, translate: boolean) {
    return {
      'opacity-0': opacity_0,
      'opacity-100': opacity_100,
      'transform translate-y-full': translate,
      'transition-transform ease-in-out duration-500': true,
      'transition-opacity ease-out duration-500': true
    }

  }

  getSaveProducts(){
    return this.objectALertClasses(!this.showAlert, this.showAlert, !this.showAlert)
  }

  //generar PDF
  generatePDF() {
    const doc = new jsPDF();

    doc.addImage('https://firebasestorage.googleapis.com/v0/b/pharmapa-e493a.appspot.com/o/images%2FSumecarLogo.png?alt=media&token=33aa3ec8-a7d0-4107-a3fb-bd599bd9c4a2', 'PNG', 10, 10, 50, 50);

    doc.text('PRODUCTOS CONFIRMADOS', 10, 10); // Título del PDF

    const columns = ['Código', 'Artículo', 'Laboratorio', 'Cantidad'];
    const rows: (string | number)[][] = [];

    this.producto_seleccionado.forEach(item => {
      rows.push([item.codigo, item.articulo, item.laboratorio, item.cantidad.toString()]);
    });

    autoTable(doc, {
      head: [columns],
      body: rows,
      margin: { top: 30, bottom: 20 },
      // ...
    })

    doc.save('table.pdf')
  }


  //generar Excel
  generarExcel() {
    import('xlsx').then((xlsx) => {
      const data = this.producto_seleccionado.map(item => ({
        'Código': item.codigo,
        'Artículo': item.articulo,
        'Laboratorio': item.laboratorio,
        'Cantidad': item.cantidad
      }));

      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'productos');
    });

  }


  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  //paginacion
  getPaginatedData(): Productos[] {
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

