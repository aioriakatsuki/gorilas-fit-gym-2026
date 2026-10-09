exportar tipo TipoAlumno = 'nuevo' | 'antiguo' | 'reingreso';
exportar tipo EstadoAlumno = 'activo' | 'baja';
exportar tipo TipoCobro = 'mensual' | 'porClase' | 'única';
exportar tipo TipoPromo = 'paquete' | '2x1' | 'descuento';

exportar interfaz Artículo adicional {
  identificación?:cadena;
  concepto:cadena;
  total:número;
  abonado:número;
  fecha?:cadena;
}

exportar interfaz Antiguo alumno {
  identificación:número;
  nombre:cadena;
  clase:cadena;
  monto:número;
  montoReal:número;
  qué:cadena;
  fecha:cadena;
  ingresar:cadena;
  estado:EstadoAlumno;
  tipoAlumno:TipoAlumno;
  promoAplicada:cadena | nulo;
  extras:Artículo adicional[];
  notas?:cadena;
  whats?:cadena;
}

exportar interfaz Promoción {
  identificación:número;
  nombre:cadena;
  tipo:TipoPromo;
  tipoCobro:TipoCobro;
  actividad:cadena;
  precio:número;
  insc?:número;
  de los hombres?:número;
  uniforme?:número;
  desc?:cadena;
  hasta:cadena;
  editable?:booleano;
}

exportar interfaz Producto {
  identificación?:número;
  nombre:cadena;
  costo:número;
  venta:número;
  existencias:número;
  categorias?:cadena;
}

exportar interfaz MovimientoIngreso {
  identificación?:cadena;
  fol?:cadena;
  fecha:cadena;
  alumno:cadena;
  clase:cadena;
  monto:número;
  concepto?:cadena;
  ganancia?:número;
  tipo?:'mensualidad' | 'producto' | 'extra' | 'inscripcion';
}

exportar interfaz MovimientoGasto {
  identificación?:cadena;
  fecha:cadena;
  concepto:cadena;
  monto:número;
  categorias?:'renta' | 'servicios' | 'profesores' | 'mercancia' | 'otros';
  auto?:booleano;
}

exportar interfaz Actividad {
  nombre:cadena;
  tipo:TipoCobro;
  monto:número;
  profesor?:cadena;
  porcentaje?:número;
}

exportar interfaz Datos de Recibo {
  fol:cadena;
  fecha:cadena;
  alumno:cadena;
  teléfono?:cadena;
  clase:cadena;
  monto:número;
  concepto?:cadena;
  proxVence?:cadena;
  tipoAlumno?:TipoAlumno;
  detalles?:cadena;
  mora?:número;
  diasAtraso?:número;
}

exportar interfaz ConfiguracionGorilas {
  moraPorDia:número;
  version?:cadena;
}

exportar interfaz Base de datos de gorilas {
  actividades:Actividad[];
  promociones:Promoción[];
  productos:Producto[];
  alumnos:Antiguo alumno[];
  ingresos:MovimientoIngreso[];
  gastos:MovimientoGasto[];
  bajas:Antiguo alumno[];
  config?:ConfiguracionGorilas;
}
