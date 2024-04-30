import { DetalleRol } from "./detalle-rol";

export interface Login {
    Usuario: string;
    Contrasena: string;
    Rol: DetalleRol [];
}
