import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataProductsService } from 'src/app/services/data-products.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Productos } from 'src/app/Interfaces/productos';
import { ProductsServicesService } from 'src/app/services/products-services.service';
@Component({
  selector: 'app-visualizar-productos',
  templateUrl: './visualizar-productos.component.html',
  styleUrls: ['./visualizar-productos.component.css']
})
export class VisualizarProductosComponent implements OnInit {
  username = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public data: DataProductsService, private productService: ProductsServicesService) { }

  displayedColumns: string[] = ['codigo', 'articulo', 'laboratorio', 'cantidad'];

  dataSource = new MatTableDataSource<Productos>([]); // Inicializa con un arreglo vacío


  ngOnInit() {
    // No configures el dataSource aquí, solo inicializa con un arreglo vacío
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Después de configurar el paginador y el ordenamiento, puedes actualizar los datos
    this.dataSource.data = this.data.selectedData;

    
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
    // Obtén los datos de los elementos en la tabla
    /*this.dataSource.data.forEach(item => {
      const codigo = item.codigo;
      const articulo = item.articulo;
      const laboratorio = item.laboratorio;
      const cantidad = item.cantidad;

      // Haz lo que necesites con estos datos, como enviarlos al servidor, mostrarlos en un mensaje, etc.
      console.log(`Código: ${codigo}, Artículo: ${articulo}, Laboratorio: ${laboratorio}, Cantidad: ${cantidad}`);
       // Inicializa con un arreglo vacío
       console.log(this.dataSource.data)
    });*/

    this.productService.confirmarProductos(this.dataSource.data,this.username).subscribe(
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

}
