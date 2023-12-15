import { Component, OnInit } from '@angular/core';
import { Productos } from 'src/app/Interfaces/productos';
import { ProductsServicesService } from 'src/app/services/products-services.service';

@Component({
  selector: 'app-productos-sales',
  standalone: true,
  imports: [],
  templateUrl: './productos-sales.component.html',
  styleUrl: './productos-sales.component.css'
})
export class ProductosSalesComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'articulo', 'laboratorio'];
  dataSource: Productos[] = [];
  originalDataSource: Productos[] = [];
  selectedRow: any;
  clickedRows = new Set<Productos>();

  //modal
  selectedProduct!: Productos;
  assignedQuantity!: number;

  //paginacion
  pageSize: number = 8;
  currentPage: number = 1;

  constructor(private servicio: ProductsServicesService) { }

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


  //seleccionar dato de la tabla
  openQuantityModal(row: any): void {
    this.selectedRow = row;
  }

  guardarProductoAsignado(producto: Productos) {
    // Crear el objeto del producto asignado
    const productoAsignado = {
      producto: producto,
      cantidad: producto.cantidad
    };
  
    // Convertir el objeto del producto asignado a una cadena JSON
    const productoAsignadoJson = JSON.stringify(productoAsignado);
  
    // Guardar la cadena JSON en LocalStorage
    localStorage.setItem(`productoAsignado_${producto.id}`, productoAsignadoJson);
  }
    
  assignQuantity() {
    this.selectedProduct.cantidad = this.assignedQuantity;
    this.guardarProductoAsignado(this.selectedProduct);
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

