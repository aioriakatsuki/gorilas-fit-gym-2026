export type TipoAlumno = 'nuevo' | 'antiguo' | 'reingreso';
export type EstadoAlumno = 'activo' | 'baja';
export type TipoCobro = 'mensual' | 'porClase' | 'unica';
export type TipoPromo = 'paquete' | '2x1' | 'descuento';

export interface ArticuloAdicional {
  id?: string;
  concepto: string;
  total: number;
  abonado: number;
  fecha?: string;
}

export interface AntiguoAlumno {
  id: number;
  nombre: string;
  clase: string;
  monto: number;
  montoReal: number;
  whats: string;
  fecha: string;
  ingreso: string;
  estado: EstadoAlumno;
  tipoAlumno: TipoAlumno;
  promoAplicada: string | null;
  extras: ArticuloAdicional[];
  notas?: string;
}

export interface Promocion {
  id: number;
  nombre: string;
  tipo: TipoPromo;
  tipoCobro: TipoCobro;
  actividad: string;
  precio: number;
  insc?: number;
  mens?: number;
  uniforme?: number;
  desc?: string;
  hasta: string;
  editable?: boolean;
}

export interface Producto {
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
  tipo?: 'mensualidad' | 'producto' | 'extra' | 'inscripcion';
}

export interface MovimientoGasto {
  id?: string;
  fecha: string;
  concepto: string;
  monto: number;
  categoria?: 'renta' | 'servicios' | 'profesores' | 'mercancia' | 'otros';
  auto?: boolean;
}

export interface Actividad {
  nombre: string;
  tipo: TipoCobro;
  monto: number;
  profe?: string;
  porcentaje?: number;
}

export interface DatosRecibo {
  folio: string;
  fecha: string;
  alumno: string;
  whats?: string;
  clase: string;
  monto: number;
  concepto?: string;
  proxVence?: string;
  tipoAlumno?: TipoAlumno;
  detalles?: string;
  mora?: number;
  diasAtraso?: number;
}

export interface ConfiguracionGorilas {
  moraPorDia: number;
  version?: string;
}

export interface BaseDeDatosGorilas {
  actividades: Actividad[];
  promociones: Promocion[];
  productos: Producto[];
  alumnos: AntiguoAlumno[];
  ingresos: MovimientoIngreso[];
  gastos: MovimientoGasto[];
  bajas: AntiguoAlumno[];
  config?: ConfiguracionGorilas;
}
