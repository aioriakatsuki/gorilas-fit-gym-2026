import { GorilasDatabase } from '../types';

export const STORAGE_KEY = 'gorilas_v5';

export const INITIAL_DATABASE: GorilasDatabase = {
  actividades: [
    { nombre: 'TAEKWONDO', tipo: 'mensual', monto: 400 },
    { nombre: 'ZUMBA', tipo: 'porClase', monto: 40, profe: 'Luna', porcentaje: 60 },
    { nombre: 'BOXEO', tipo: 'mensual', monto: 400 },
    { nombre: 'TRX', tipo: 'mensual', monto: 350 },
  ],
  promos: [
    {
      id: 1,
      nombre: 'Promo Nuevo Ingreso TKD',
      tipo: 'paquete',
      tipoCobro: 'mensual',
      actividad: 'TAEKWONDO',
      precio: 780,
      insc: 400,
      mens: 400,
      uniforme: 450,
      desc: 'Inscripción $400 + Mens $400 + Uniforme $450 = $1250 pero promo $780',
      hasta: '2026-12-31',
      editable: true,
    },
    {
      id: 2,
      nombre: '2x1 Zumba por clase',
      tipo: '2x1',
      tipoCobro: 'porClase',
      actividad: 'ZUMBA',
      precio: 40,
      desc: 'Pagas 1 clase $40 y van 2 personas',
      hasta: '2026-10-31',
    },
    {
      id: 3,
      nombre: 'Reingreso TKD',
      tipo: 'reinscripcion',
      tipoCobro: 'mensual',
      actividad: 'TAEKWONDO',
      precio: 400,
      desc: 'Para los que se fueron y regresan - se cobra reinscripción $400 + mensualidad',
      hasta: '2027-12-31',
    },
  ],
  productos: [
    { nombre: 'Agua', costo: 8, venta: 15, stock: 50, categoria: 'Bebidas' },
    { nombre: 'Vendas', costo: 30, venta: 60, stock: 20, categoria: 'Equipo' },
    { nombre: 'Uniforme TKD', costo: 350, venta: 450, stock: 10, categoria: 'Indumentaria' },
    { nombre: 'Electrolit / Bebida isotónica', costo: 22, venta: 35, stock: 24, categoria: 'Bebidas' },
    { nombre: 'Guantes de Box', costo: 350, venta: 550, stock: 8, categoria: 'Equipo' },
  ],
  alumnos: [
    {
      id: 1,
      nombre: 'Maximo Galindo',
      clase: 'TAEKWONDO',
      monto: 400,
      montoReal: 400,
      whats: '5512345678',
      fecha: '2026-11-08',
      ingreso: '2026-08-01',
      status: 'activo',
      tipoAlumno: 'antiguo',
      promoAplicada: null,
      extras: [],
    },
  ],
  ingresos: [
    {
      id: 'ing-1',
      folio: '784201',
      fecha: '2026-10-01',
      alumno: 'Maximo Galindo',
      clase: 'TAEKWONDO',
      monto: 400,
      concepto: 'Mensualidad Octubre',
      tipo: 'mensualidad',
    },
  ],
  gastos: [],
  bajas: [],
};

export function loadDatabase(): GorilasDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveDatabase(INITIAL_DATABASE);
      return INITIAL_DATABASE;
    }
    const parsed = JSON.parse(raw);
    return {
      actividades: parsed.actividades?.length ? parsed.actividades : INITIAL_DATABASE.actividades,
      promos: parsed.promos || INITIAL_DATABASE.promos,
      productos: parsed.productos || INITIAL_DATABASE.productos,
      alumnos: parsed.alumnos || [],
      ingresos: parsed.ingresos || [],
      gastos: parsed.gastos || [],
      bajas: parsed.bajas || [],
    };
  } catch (err) {
    console.error('Error loading database from localStorage:', err);
    return INITIAL_DATABASE;
  }
}

export function saveDatabase(db: GorilasDatabase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Error saving database to localStorage:', err);
  }
}

export function exportDatabaseJSON(db: GorilasDatabase): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(db, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `gorilas_fit_respaldo_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
