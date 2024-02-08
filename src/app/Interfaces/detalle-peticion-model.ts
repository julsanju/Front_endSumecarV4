import { DetallePeticionP } from "./detalle-peticionP";

export interface DetallePeticionModel {
   cliente:string,
   identificacion:string,
   telefono:string,
   direccion:string,
   ciudad:string,
   numero_peticion:string,
   detalle?: DetallePeticionP [] 
}
