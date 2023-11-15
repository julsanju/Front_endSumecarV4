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
@Component({
  selector: 'app-visualizar-productos',
  templateUrl: './visualizar-productos.component.html',
  styleUrls: ['./visualizar-productos.component.css']
})
export class VisualizarProductosComponent implements OnInit {
  username = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datosPdf: (string | URL)[][] = [];
  constructor(public data: DataProductsService, private productService: ProductsServicesService, private pdfService: PdfServicesService) { }

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
        console.log("Registro exitoso");
      },
      error => {
        console.error("Error:", error);
        console.log(error.error)
        console.log("Error en el registro");
      },

    );
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
