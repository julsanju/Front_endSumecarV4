import { DetalleDetallePeticionModel } from "./detalle-detalle-peticion-model";


export interface DetallePeticionModel {
   cliente:string,
   correo:string,
   mensaje:string,
   identificacion:string,
   telefono:string,
   direccion:string,
   ciudad:string,
   detalle?: DetalleDetallePeticionModel [] 
}
