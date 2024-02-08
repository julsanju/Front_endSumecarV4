import { DetallePeticionModel } from "./detalle-peticion-model";

export interface Correo extends DetallePeticionModel{
    correo:string,
    mensaje:string
}
