import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataProductsService } from 'src/app/services/data-products.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Productos } from 'src/app/Interfaces/productos';
import { ProductsServicesService } from 'src/app/services/products-services.service';
import { PdfServicesService } from 'src/app/services/pdf-services.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PdfInterface } from 'src/app/Interfaces/pdf-interface';
import Swal from 'sweetalert2';
import { MensajeError } from 'src/app/Interfaces/mensaje-error';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-visualizar-productos',
  standalone: true,
  imports : [ReactiveFormsModule,MatPaginatorModule, MatTableModule,
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
    MatCardModule, FormsModule],
  templateUrl: './visualizar-productos.component.html',
  styleUrls: ['./visualizar-productos.component.css']
})
export class VisualizarProductosComponent implements OnInit {
  username = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datosPdf: (string | URL)[][] = [];
  spinner: boolean = false;
  errorMessage: MensajeError | null = null;
  
  constructor(public data: DataProductsService, 
    private productService: ProductsServicesService, 
    private pdfService: PdfServicesService,
    private router:Router) { }

  displayedColumns: string[] = ['codigo', 'articulo', 'laboratorio', 'cantidad'];

  dataSource = new MatTableDataSource<Productos>([]); // Inicializa con un arreglo vacío
  dataSource2 = new MatTableDataSource<PdfInterface>([]);

  ngOnInit() {
    // No configures el dataSource aquí, solo inicializa con un arreglo vacío

  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Después de configurar el paginador y el ordenamiento, puedes actualizar los datos
    this.dataSource.data = this.data.selectedData;
    setTimeout(() => {
      this.generateTableHTML();
    }, 0);

  }

  updateCantidad(item: Productos): void {
    // Verificar si la cantidad es un número válido
    const nuevaCantidad = (item.cantidad);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
      // Si la cantidad no es un número válido o es negativa, muestra una alerta y restaura el valor anterior
      alert('Por favor ingrese un numero valido para la cantidad');
      item.cantidad = item.cantidad; // Restaura el valor anterior
    } else {
      // Realiza cualquier acción adicional necesaria aquí, por ejemplo, guardar los cambios en el servidor
      // En este ejemplo, simplemente actualizamos la cantidad en el objeto Productos
      item.cantidad = nuevaCantidad;
    }
  }

  //evento del boton de confirmar
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
    

    this.productService.confirmarProductos(this.dataSource.data, this.username).subscribe(
      response => {
        console.log(response);
        this.spinner = false;

        Swal.fire('Su producto ha sido confirmado exitosamente!', '', 'success');

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito
        console.log('Login exitoso');
        this.router.navigate(['menu/productos']);
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
  }

  //metodo para cancelar productos
  onClickButton() {
    //salir el spínner
    
      // Recargar la página después del tiempo de espera
      this.spinner = false;
        Swal.fire('Su producto ha sido cancelado exitosamente!', '', 'success');

        this.errorMessage = null; // Limpiar el mensaje de error si hubo éxito
        
    // Navegar a la nueva página
      this.router.navigate(['/menu/productos']);
    
    
  
    // Recargar la página actual
    
  }

  refrescar(){
    // Esperar 2 segundos (ajusta el tiempo según tus necesidades)
    const tiempoEspera = 1000; // en milisegundos (2 segundos en este ejemplo)
    
    setTimeout(() => {
      // Recargar la página después del tiempo de espera
      location.reload();
    }, tiempoEspera);
  }
  generateTableHTML() {
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
      // Obtén el contenido HTML de la tabla
      const tableHTML = tableContainer.innerHTML;
      return tableHTML;
    }
    return '';
  }
  

  generateTableData() {
    const tableData = [];
    tableData.push(['Código', 'Artículo', 'Laboratorio', 'Cantidad']); // Encabezados de la tabla

    this.dataSource.data.forEach(item => {
      tableData.push([item.codigo, item.articulo, item.laboratorio, item.cantidad.toString()]); // Convierte cantidad a cadena
    });

    return tableData;
  }



  generatePDF() {
    const doc = new jsPDF();
    const imgData = "C:/julian/xd.jpg";
    //const imgData = 'https://sumecar.com/img/SumecarLogo.png';
    doc.addImage(imgData, 'JPEG', 10, 20, 50, 50); 

    doc.text('PRODUCTOS CONFIRMADOS', 10, 10); // Título del PDF

    const columns = ['Código', 'Artículo', 'Laboratorio', 'Cantidad'];
    const rows: (string | number)[][] = [];


    this.dataSource.data.forEach(item => {
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

  
  


}
