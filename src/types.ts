export type TipoAlumno = 'nuevo' | 'antiguo' | 'reingreso';
export type StatusAlumno = 'activo' | 'baja';
export type TipoCobro = 'mensual' | 'porClase' | 'unico';
export type TipoPromo = 'paquete' | '2x1' | 'descuento' | 'reinscripcion' | 'clases';

export interface ExtraItem {
  id?: string;
  concepto: string;
  total: number;
  abonado: number;
  fecha?: string;
}

export interface Alumno {
  id: number;
  nombre: string;
  clase: string;
  monto: number;       // Base price of activity
  montoReal: number;   // What student actually pays per period
  whats: string;
  fecha: string;       // Next expiration date (YYYY-MM-DD)
  ingreso: string;     // Join date (YYYY-MM-DD)
  status: StatusAlumno;
  tipoAlumno: TipoAlumno;
  promoAplicada: string | null;
  extras: ExtraItem[];
  notas?: string;
}

export interface Promo {
  id: number;
  nombre: string;
  tipo: TipoPromo;
  tipoCobro: TipoCobro;
  actividad: string; // 'TAEKWONDO' | 'ZUMBA' | 'TODAS' etc.
  precio: number;
  insc?: number;
  mens?: number;
  uniforme?: number;
  desc: string;
  hasta: string;     // Expiration date (YYYY-MM-DD)
  editable?: boolean;
}

export interface Producto {
  id?: number;
  nombre: string;
  costo: number;
  venta: number;
  stock: number;
  categoria?: string;
}

export interface MovimientoIngreso {
  id?: string;
  folio?: string;
  fecha: string;
  alumno: string;
  clase: string;
  monto: number;
  concepto?: string;
  ganancia?: number;
  tipo?: 'mensualidad' | 'producto' | 'extra' | 'inscripcion' | 'otro';
}

export interface MovimientoGasto {
  id?: string;
  fecha: string;
  concepto: string;
  monto: number;
  categoria?: 'renta' | 'servicios' | 'profesores' | 'mercancia' | 'mantenimiento' | 'otro';
}

export interface Actividad {
  nombre: string;
  tipo: TipoCobro;
  monto: number;
  profe?: string;
  porcentaje?: number;
}

export interface ReciboData {
  folio: string;
  fecha: string;
  alumno: string;
  telefono?: string;
  clase: string;
  monto: number;
  concepto?: string;
  proxVence?: string;
  tipoAlumno?: TipoAlumno;
  detalles?: string;
}

export interface GorilasDatabase {
  actividades: Actividad[];
  promos: Promo[];
  productos: Producto[];
  alumnos: Alumno[];
  ingresos: MovimientoIngreso[];
  gastos: MovimientoGasto[];
  bajas: Alumno[];
}
