import { Productos } from "./productos";

export interface DatosAccordeon {
    numero_orden:number,
    fecha:string,
    cliente:string,
    telefono:string,
    cantidad_items:number,
    detalle?: Productos[];
}
