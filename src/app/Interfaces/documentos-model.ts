import { DetalleDocumento } from "./detalle-documento";

export interface DocumentosModel {
    numero_orden:number,
    fecha:Date,
    cliente:string,
    usuario:string,
    detalles:DetalleDocumento[]
}
