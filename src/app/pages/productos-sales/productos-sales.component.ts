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
import { PdfServicesService } from 'src/app/services/pdf-services.service';
import { PdfInterface } from 'src/app/Interfaces/pdf-interface';

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
  dataPDf: PdfInterface[] = [];
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
  cargando = false;
  //paginacion
  pageSize: number = 8;
  currentPage: number = 1;
  //sweet Alert
  spinner: boolean = false;
  username = '';
  errorMessage: MensajeError | null = null;
  //dawner
  estadoBotones: boolean = false;

  hayProductosSeleccionados: boolean = false;

  constructor(private dataServices: DataProductsService,
    private servicio: ProductsServicesService,
    private pdfService: PdfServicesService,
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

    this.hayProductosSeleccionados = false;
    if(this.producto_seleccionado.length >= 1){
      this.hayProductosSeleccionados = true;
    }

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
    this.hayProductosSeleccionados = true;
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
        
        const numero_orden = response && response.hasOwnProperty('numeroOrden') ? response.numeroOrden : '';
        
        this.spinner = false;

        Swal.fire('Su producto ha sido confirmado exitosamente!', '', 'success');

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito

        this.generatePDF(numero_orden);
        this.generarExcel(numero_orden)
        this.hayProductosSeleccionados = true; 
        this.producto_seleccionado = [];
        this.hayProductosSeleccionados = false;
        
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
  
  //metodo para cancelar los productos seleccionados
  cancelar(){
    this.cargando = true
    setTimeout(() => {
      // borrar los productos después del tiempo de espera
      this.producto_seleccionado = [];
      this.cargando = false
      this.hayProductosSeleccionados = false
    }, 1000);
    
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

  getSaveProducts() {
    return this.objectALertClasses(!this.showAlert, this.showAlert, !this.showAlert)
  }

  //obtener datos para setear en pdf
  /*obtenerDataPdf(){
    const userDataString = localStorage.getItem('userData');
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
    //servicio para mostrar datos pdf
    this.pdfService.mostrar_datosPdf(this.username).subscribe(
      response => {
        this.dataPDf = response;
      },
      error => {
        console.error("Error:", error);
        
      },

    );
  }*/

  //generar PDF
  generatePDF = async (numero_orden:string) => {

    const userDataString = localStorage.getItem('userData');
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
    //servicio para mostrar datos pdf
    this.pdfService.mostrar_datosPdf(this.username).subscribe(
      (response) => {
        this.dataPDf = response;
        this.dataPDf.forEach(element => {
          const doc = new jsPDF();

          /**ENCABEZADO***/
          // Establecer la posición inicial y el tamaño de la imagen
          const imgWidth = 50;
          const imgHeight = 30;
          const imgX = 10;
          const imgY = 10;

          // Agregar la imagen a la izquierda
          const img = 'https://i.postimg.cc/MKQq1cmg/Sumecar-Logo.png';
          doc.addImage(img, 'JPG', imgX, imgY, imgWidth, imgHeight);

          // Ajustar la posición del primer título
          const titleX = imgX + imgWidth + 70; // Ajustar la posición horizontal del título
          const titleY = imgY + 5; // Ajustar la posición vertical del primer título
          // Tamaño de fuente más pequeño
          const fontSize = 10;
          // Agregar los títulos uno debajo del otro
          const titles = [
            'SUMINISTRADORA DE MEDICAMENTOS DEL CARIBE S.A',
            'SUMECAR S.A',
            'NIT. 806.009.848-3',
            'Iva Régimen Común',
            'No Somos Gran Contribuyente',
            'No somos Autoretenedores'
          ];

          //convertir el tipo date en objeto
          const fecha = new Date(element.fecha);
          const hora = new Date(element.fecha);

          const additionalTexts = [
            'FECHA: ' + fecha.toLocaleDateString(),
            'HORA: ' + hora.toLocaleTimeString(),
            'Cliente: ' + element.nombre.toUpperCase() +" "+ element.apellido.toUpperCase(),
            'Identificacion: ' + element.identificacion.toUpperCase(),
            'Telefono: ' + element.telefono.toUpperCase(),
            'Direccion: ' + element.ubicacion.toUpperCase(),
            'Ciudad: ' + element.ciudad.toUpperCase(),
          ];


          /**CUERPO DEL PDF**/
          // Agregar otros textos en el cuerpo del PDF


          const additionalTextY = titleY + titles.length * 5 + 10; // Ajustar la posición vertical para los textos adicionales
          const textXPosition = 15; // Ajustar la posición horizontal para los textos adicionales
          const textWidth = 100; // Ajustar el ancho del rectángulo
          const totalTextHeight = additionalTexts.length * 6;

          doc.rect(textXPosition - 2, additionalTextY - 6, textWidth + 4, totalTextHeight + 4);

          additionalTexts.forEach((text, index) => {
            const textYPosition = additionalTextY + index * 6;

            doc.setFontSize(fontSize);
            doc.text(text, textXPosition, textYPosition, { align: 'justify' });
          });

          titles.forEach((title, index) => {
            // Calcular automáticamente la posición vertical
            const titleYPosition = titleY + index * 5; // Puedes ajustar el espacio entre líneas cambiando el valor multiplicativo (ej. 10)

            doc.setFontSize(fontSize);
            // Agregar el título
            doc.text(title, titleX, titleYPosition, { align: 'center' });
          });

          /**AGREGAR OTROS TEXTOS A LA DERECHA CON UNA LÍNEA SEPARADORA**/
          //cantidad de items 
          const cantidad_items = this.producto_seleccionado.length;
          const otherTexts = [
            '#ORDEN: ' + numero_orden,
            'Cantidad de items: ' + cantidad_items,
          ];

          const otherTextX = textXPosition + textWidth + 4; // Ajustar el valor según sea necesario
          const otherTextY = additionalTextY; // Ajustar la posición vertical para los otros textos

          // Dibujar un rectángulo alrededor de los "otros textos"
          const otherTextsWidth = 75; // Ajustar el ancho del rectángulo
          const otherTextsHeight = otherTexts.length * 6;
          doc.rect(otherTextX - 2, otherTextY - 6, otherTextsWidth + 4, otherTextsHeight + 34);

          otherTexts.forEach((text, index) => {
            const textYPosition = otherTextY + index * 10; // Ajustar la separación vertical según sea necesario
            doc.setFontSize(15);
            doc.text(text, otherTextX + otherTextsWidth, textYPosition, { align: 'right' });

          });


          /**TABLA DE LA INFORMACION***/
          const columns = ['Código', 'Artículo', 'Laboratorio', 'Cantidad'];
          const rows: (string | number)[][] = [];

          this.producto_seleccionado.forEach(item => {
            rows.push([item.codigo, item.articulo, item.laboratorio, item.cantidad.toString()]);
          });

          autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 100,
            margin: { top: 10, bottom: 30 }
          })

          doc.save('numero de orden #'+numero_orden+'.pdf')
        });
      },
      error => {
        console.error("Error:", error);

      },

    );




  }


  //generar Excel
  generarExcel(numero_orden:string) {
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
      this.saveAsExcelFile(excelBuffer, 'numero', numero_orden);
    });

  }


  saveAsExcelFile(buffer: any, fileName: string, numero_orden: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    //FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    FileSaver.saveAs(data, fileName + '_de_orden_' + numero_orden + EXCEL_EXTENSION);
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

