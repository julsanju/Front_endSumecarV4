import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Productos } from 'src/app/Interfaces/productos';
import { DataProductsService } from 'src/app/services/data-products.service';
import { ProductsServicesService } from 'src/app/services/products-services.service';

@Component({
  selector: 'app-productos-sales',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './productos-sales.component.html',
  styleUrl: './productos-sales.component.css'
})
export class ProductosSalesComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'articulo', 'laboratorio'];
  dataSource: Productos[] = [];
  originalDataSource: Productos[] = [];
  selectedRow: any;
  clickedRows = new Set<Productos>();
  cantidadForm : FormGroup;
  cantidadValue !: number;
  producto_seleccionado !: Productos
  //modal
  
  assignedQuantity!: number;
  showModal : boolean = false;
  //paginacion
  pageSize: number = 8;
  currentPage: number = 1;

  constructor(private dataServices: DataProductsService,private servicio: ProductsServicesService, private formBuilder: FormBuilder) { 
    
    this.cantidadForm = this.formBuilder.group({
      cantidad : ['', Validators.required]
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

  productoSeleccionado(producto : Productos) {
    this.producto_seleccionado = producto;
  }
  
  guardarProductoAsignado() {
    // Obtén el valor actual del campo 'cantidad'
     this.cantidadValue = this.cantidadForm.get('cantidad')!.value;
  
    // Asegúrate de que haya un producto seleccionado y la cantidad no sea undefined
    if (this.producto_seleccionado && this.cantidadValue !== undefined) {
      // Agrega el producto y la cantidad a las listas
      this.dataSource.push(this.producto_seleccionado);
      this.dataServices.selectedData.push({
        producto: this.producto_seleccionado,
        cantidad: this.cantidadValue
      });
    }
  }

  asignarCantidad() {
    
    
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

