import { DetallePeticionP } from "./detalle-peticionP"

export interface Peticiones {
    id:number
    numero_peticion:number
    correo:string
    mensaje:string
    fecha:string
    cliente:string
    identificacion:string
    telefono:string
    direccion:string
    ciudad:string
    estado:string
    detalle?: DetallePeticionP[] 
}
