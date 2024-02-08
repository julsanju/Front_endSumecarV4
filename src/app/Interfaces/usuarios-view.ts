import { Correo } from "./correo"
import { DetallePeticionP } from "./detalle-peticionP"

export interface UsuariosView {
    identificacion:string
    nombre:string,
    apellido:string,
    telefono:string
    correo:string
    rol:number
    estado: null,
    token: null,
    usuario: null,
    ubicacion:string,
    ciudad:string,
    contrasena: null,
    detalle?: DetallePeticionP [] 
}
