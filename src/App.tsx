/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GorilasDatabase,
  Alumno,
  Promo,
  Producto,
  MovimientoGasto,
  ReciboData,
  Actividad,
} from './types';
import {
  loadDatabase,
  saveDatabase,
  exportDatabaseJSON,
} from './utils/storage';
import { getTodayStr, diasRestantes, calcularDiasAtraso, calcularMora } from './utils/date';

// Components
import { Header } from './components/Header';
import { AlumnosTab } from './components/AlumnosTab';
import { PromosTab } from './components/PromosTab';
import { TiendaTab } from './components/TiendaTab';
import { CajaTab } from './components/CajaTab';
import { ActividadesTab } from './components/ActividadesTab';

// Modals
import { TicketModal } from './components/TicketModal';
import { NuevoAlumnoModal } from './components/NuevoAlumnoModal';
import { CobrarModal } from './components/CobrarModal';
import { CobrarExtraModal } from './components/CobrarExtraModal';
import { EditarAlumnoModal } from './components/EditarAlumnoModal';
import { HistorialAlumnoModal } from './components/HistorialAlumnoModal';
import { PromosModal } from './components/PromosModal';
import { VenderProductoModal } from './components/VenderProductoModal';
import { ProductoModal } from './components/ProductoModal';
import { GastoModal } from './components/GastoModal';

export default function App() {
  const [db, setDb] = useState<GorilasDatabase>(() => loadDatabase());
  const [currentTab, setCurrentTab] = useState<'alumnos' | 'promos' | 'tienda' | 'caja' | 'actividades'>('alumnos');

  // Modals state
  const [reciboActual, setReciboActual] = useState<ReciboData | null>(null);
  const [isNuevoAlumnoOpen, setIsNuevoAlumnoOpen] = useState(false);
  const [alumnoCobrar, setAlumnoCobrar] = useState<Alumno | null>(null);
  const [alumnoExtra, setAlumnoExtra] = useState<Alumno | null>(null);
  const [alumnoEditar, setAlumnoEditar] = useState<Alumno | null>(null);
  const [alumnoHistorial, setAlumnoHistorial] = useState<Alumno | null>(null);

  // Promo modal state
  const [promoEditar, setPromoEditar] = useState<Promo | null>(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  // Store modal state
  const [productoVenderIdx, setProductoVenderIdx] = useState<number | null>(null);
  const [productoEditarIdx, setProductoEditarIdx] = useState<number | null>(null);
  const [isNuevoProductoOpen, setIsNuevoProductoOpen] = useState(false);

  // Gasto modal state
  const [isGastoModalOpen, setIsGastoModalOpen] = useState(false);

  // Auto-save database to localStorage whenever it changes
  useEffect(() => {
    saveDatabase(db);
  }, [db]);

  // Automatic cleanup of overdue students (> 60 days moved to bajas)
  useEffect(() => {
    let changed = false;
    const newAlumnos: Alumno[] = [];
    const newBajas: Alumno[] = [...db.bajas];

    db.alumnos.forEach((a) => {
      const d = diasRestantes(a.fecha);
      if (d < -60 && a.status !== 'baja') {
        changed = true;
        newBajas.push({ ...a, status: 'baja' });
      } else {
        newAlumnos.push(a);
      }
    });

    if (changed) {
      setDb((prev) => ({
        ...prev,
        alumnos: newAlumnos,
        bajas: newBajas,
      }));
    }
  }, []);

  // Summary calculations
  const totalIngresos = db.ingresos.reduce((sum, item) => sum + item.monto, 0);
  const totalGastos = db.gastos.reduce((sum, item) => sum + item.monto, 0);
  const totalVencidos = db.alumnos.filter((a) => diasRestantes(a.fecha) < 0).length;

  // ---------------- Handlers for Alumnos ---------------- //

  const handleNuevoAlumnoSubmit = (data: {
    nombre: string;
    clase: string;
    monto: number;
    montoReal: number;
    whats: string;
    fecha: string;
    ingreso: string;
    tipoAlumno: Alumno['tipoAlumno'];
    promoAplicada: string | null;
    cobroInicial: number;
    conceptoInicial: string;
    detallesInicial?: string;
  }) => {
    const newId = Date.now();
    const newFolio = newId.toString().slice(-6);

    const newAlumno: Alumno = {
      id: newId,
      nombre: data.nombre,
      clase: data.clase,
      monto: data.monto,
      montoReal: data.montoReal,
      whats: data.whats,
      fecha: data.fecha,
      ingreso: data.ingreso,
      status: 'activo',
      tipoAlumno: data.tipoAlumno,
      promoAplicada: data.promoAplicada,
      extras: [],
    };

    const newIngreso = {
      id: `ing-${newId}`,
      folio: newFolio,
      fecha: getTodayStr(),
      alumno: data.nombre,
      clase: data.clase,
      monto: data.cobroInicial,
      concepto: data.conceptoInicial,
      tipo: 'inscripcion' as const,
    };

    setDb((prev) => ({
      ...prev,
      alumnos: [newAlumno, ...prev.alumnos],
      ingresos: [newIngreso, ...prev.ingresos],
    }));

    // Trigger digital receipt
    setReciboActual({
      folio: newFolio,
      fecha: getTodayStr(),
      alumno: data.nombre,
      telefono: data.whats,
      clase: data.clase,
      monto: data.cobroInicial,
      concepto: data.conceptoInicial,
      proxVence: data.fecha,
      tipoAlumno: data.tipoAlumno,
      detalles: data.detallesInicial,
    });
  };

  const handleCobrarSubmit = (data: {
    alumnoId: number;
    monto: number;
    nuevoVencimiento: string;
    concepto: string;
  }) => {
    const alumno = db.alumnos.find((a) => a.id === data.alumnoId);
    if (!alumno) return;

    const folio = Date.now().toString().slice(-6);

    const newIngreso = {
      id: `ing-${Date.now()}`,
      folio,
      fecha: getTodayStr(),
      alumno: alumno.nombre,
      clase: alumno.clase,
      monto: data.monto,
      concepto: data.concepto,
      tipo: 'mensualidad' as const,
    };

    setDb((prev) => ({
      ...prev,
      alumnos: prev.alumnos.map((a) =>
        a.id === data.alumnoId ? { ...a, fecha: data.nuevoVencimiento, status: 'activo' } : a
      ),
      ingresos: [newIngreso, ...prev.ingresos],
    }));

    // Trigger digital receipt
    setReciboActual({
      folio,
      fecha: getTodayStr(),
      alumno: alumno.nombre,
      telefono: alumno.whats,
      clase: alumno.clase,
      monto: data.monto,
      concepto: data.concepto,
      proxVence: data.nuevoVencimiento,
      tipoAlumno: alumno.tipoAlumno,
    });
  };

  const handleCobrarExtraSubmit = (data: {
    alumnoId: number;
    concepto: string;
    total: number;
    abonado: number;
  }) => {
    const alumno = db.alumnos.find((a) => a.id === data.alumnoId);
    if (!alumno) return;

    const folio = Date.now().toString().slice(-6);

    const newExtras = [...(alumno.extras || [])];
    const existingIndex = newExtras.findIndex(
      (e) => e.concepto.toLowerCase() === data.concepto.toLowerCase()
    );

    if (existingIndex >= 0) {
      newExtras[existingIndex] = {
        ...newExtras[existingIndex],
        total: data.total,
        abonado: newExtras[existingIndex].abonado + data.abonado,
      };
    } else {
      newExtras.push({
        concepto: data.concepto,
        total: data.total,
        abonado: data.abonado,
        fecha: getTodayStr(),
      });
    }

    const newIngreso = {
      id: `ing-${Date.now()}`,
      folio,
      fecha: getTodayStr(),
      alumno: alumno.nombre,
      clase: alumno.clase,
      monto: data.abonado,
      concepto: `Extra: ${data.concepto}`,
      tipo: 'extra' as const,
    };

    setDb((prev) => ({
      ...prev,
      alumnos: prev.alumnos.map((a) => (a.id === data.alumnoId ? { ...a, extras: newExtras } : a)),
      ingresos: [newIngreso, ...prev.ingresos],
    }));

    setReciboActual({
      folio,
      fecha: getTodayStr(),
      alumno: alumno.nombre,
      telefono: alumno.whats,
      clase: alumno.clase,
      monto: data.abonado,
      concepto: `Abono Extra: ${data.concepto}`,
      proxVence: alumno.fecha,
      detalles: `Abono $${data.abonado} de Total $${data.total}`,
    });
  };

  const handleEditarAlumnoSave = (alumnoActualizado: Alumno) => {
    setDb((prev) => ({
      ...prev,
      alumnos: prev.alumnos.map((a) => (a.id === alumnoActualizado.id ? alumnoActualizado : a)),
      bajas: prev.bajas.map((a) => (a.id === alumnoActualizado.id ? alumnoActualizado : a)),
    }));
  };

  const handleDeleteAlumno = (id: number) => {
    setDb((prev) => ({
      ...prev,
      alumnos: prev.alumnos.filter((a) => a.id !== id),
      bajas: prev.bajas.filter((a) => a.id !== id),
    }));
  };

  const handleToggleBaja = (id: number) => {
    const alumnoEnAlumnos = db.alumnos.find((a) => a.id === id);
    if (alumnoEnAlumnos) {
      setDb((prev) => ({
        ...prev,
        alumnos: prev.alumnos.filter((a) => a.id !== id),
        bajas: [{ ...alumnoEnAlumnos, status: 'baja' }, ...prev.bajas],
      }));
      return;
    }

    const alumnoEnBajas = db.bajas.find((a) => a.id === id);
    if (alumnoEnBajas) {
      setDb((prev) => ({
        ...prev,
        bajas: prev.bajas.filter((a) => a.id !== id),
        alumnos: [{ ...alumnoEnBajas, status: 'activo' }, ...prev.alumnos],
      }));
    }
  };

  // ---------------- Handlers for Promos ---------------- //

  const handleSavePromo = (promo: Promo) => {
    setDb((prev) => {
      const exists = prev.promos.some((p) => p.id === promo.id);
      if (exists) {
        return {
          ...prev,
          promos: prev.promos.map((p) => (p.id === promo.id ? promo : p)),
        };
      }
      return {
        ...prev,
        promos: [promo, ...prev.promos],
      };
    });
  };

  const handleDeletePromo = (id: number) => {
    setDb((prev) => ({
      ...prev,
      promos: prev.promos.filter((p) => p.id !== id),
    }));
  };

  // ---------------- Handlers for Store ---------------- //

  const handleVenderProductoSubmit = (data: {
    productoIndex: number;
    cliente: string;
    telefono?: string;
    cantidad: number;
    total: number;
    ganancia: number;
  }) => {
    const prod = db.productos[data.productoIndex];
    if (!prod) return;

    const folio = Date.now().toString().slice(-6);

    const newProductos = [...db.productos];
    newProductos[data.productoIndex] = {
      ...prod,
      stock: Math.max(0, prod.stock - data.cantidad),
    };

    const newIngreso = {
      id: `ing-${Date.now()}`,
      folio,
      fecha: getTodayStr(),
      alumno: data.cliente,
      clase: prod.nombre,
      monto: data.total,
      ganancia: data.ganancia,
      concepto: `Venta: ${data.cantidad}x ${prod.nombre}`,
      tipo: 'producto' as const,
    };

    setDb((prev) => ({
      ...prev,
      productos: newProductos,
      ingresos: [newIngreso, ...prev.ingresos],
    }));

    setReciboActual({
      folio,
      fecha: getTodayStr(),
      alumno: data.cliente,
      telefono: data.telefono,
      clase: `Tienda - ${prod.nombre}`,
      monto: data.total,
      concepto: `Compra: ${data.cantidad}x ${prod.nombre}`,
      detalles: `Precio unitario: $${prod.venta} MXN`,
    });
  };

  const handleSaveProducto = (prod: Producto) => {
    if (productoEditarIdx !== null) {
      setDb((prev) => {
        const copy = [...prev.productos];
        copy[productoEditarIdx] = prod;
        return { ...prev, productos: copy };
      });
      setProductoEditarIdx(null);
    } else {
      setDb((prev) => ({
        ...prev,
        productos: [...prev.productos, prod],
      }));
    }
  };

  const handleRestock = (index: number, delta: number) => {
    setDb((prev) => {
      const copy = [...prev.productos];
      if (copy[index]) {
        copy[index] = { ...copy[index], stock: copy[index].stock + delta };
      }
      return { ...prev, productos: copy };
    });
  };

  // ---------------- Handlers for Caja ---------------- //

  const handleAddGasto = (gasto: MovimientoGasto) => {
    setDb((prev) => ({
      ...prev,
      gastos: [gasto, ...prev.gastos],
    }));
  };

  const handleDeleteIngreso = (index: number) => {
    setDb((prev) => {
      const copy = [...prev.ingresos];
      copy.splice(index, 1);
      return { ...prev, ingresos: copy };
    });
  };

  const handleDeleteGasto = (index: number) => {
    setDb((prev) => {
      const copy = [...prev.gastos];
      copy.splice(index, 1);
      return { ...prev, gastos: copy };
    });
  };

  // ---------------- Handlers for Backup & Restore ---------------- //

  const handleExportBackup = () => {
    exportDatabaseJSON(db);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && (parsed.alumnos || parsed.actividades)) {
          setDb(parsed);
          saveDatabase(parsed);
          alert('¡Copia de seguridad restaurada con éxito!');
        } else {
          alert('El archivo no contiene un formato válido de Gorilas Fit.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-white flex flex-col font-sans selection:bg-yellow-400 selection:text-black">
      {/* Header and top metrics bar */}
      <Header
        ingresosTotal={totalIngresos}
        gastosTotal={totalGastos}
        currentTab={currentTab}
        setTab={setCurrentTab}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        totalAlumnos={db.alumnos.length}
        totalVencidos={totalVencidos}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-3 sm:p-4">
        {currentTab === 'alumnos' && (
          <AlumnosTab
            alumnos={db.alumnos}
            bajas={db.bajas}
            actividades={db.actividades}
            onNuevoAlumno={() => setIsNuevoAlumnoOpen(true)}
            onCobrar={(alumno) => setAlumnoCobrar(alumno)}
            onCobrarExtra={(alumno) => setAlumnoExtra(alumno)}
            onEditar={(alumno) => setAlumnoEditar(alumno)}
            onVerHistorial={(alumno) => setAlumnoHistorial(alumno)}
            onReactivarBaja={(alumno) => handleToggleBaja(alumno.id)}
          />
        )}

        {currentTab === 'promos' && (
          <PromosTab
            promos={db.promos}
            onNuevaPromo={() => {
              setPromoEditar(null);
              setIsPromoModalOpen(true);
            }}
            onEditarPromo={(promo) => {
              setPromoEditar(promo);
              setIsPromoModalOpen(true);
            }}
            onBorrarPromo={handleDeletePromo}
          />
        )}

        {currentTab === 'tienda' && (
          <TiendaTab
            productos={db.productos}
            onVenderProducto={(idx) => setProductoVenderIdx(idx)}
            onNuevoProducto={() => {
              setProductoEditarIdx(null);
              setIsNuevoProductoOpen(true);
            }}
            onEditarProducto={(idx) => {
              setProductoEditarIdx(idx);
              setIsNuevoProductoOpen(true);
            }}
            onRestock={handleRestock}
          />
        )}

        {currentTab === 'caja' && (
          <CajaTab
            ingresos={db.ingresos}
            gastos={db.gastos}
            onAddGasto={() => setIsGastoModalOpen(true)}
            onDeleteIngreso={handleDeleteIngreso}
            onDeleteGasto={handleDeleteGasto}
          />
        )}

        {currentTab === 'actividades' && (
          <ActividadesTab
            actividades={db.actividades}
            onSaveActividades={(nuevas) => setDb((prev) => ({ ...prev, actividades: nuevas }))}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <TicketModal
        recibo={reciboActual}
        onClose={() => setReciboActual(null)}
      />

      <NuevoAlumnoModal
        actividades={db.actividades}
        promos={db.promos}
        isOpen={isNuevoAlumnoOpen}
        onClose={() => setIsNuevoAlumnoOpen(false)}
        onSubmit={handleNuevoAlumnoSubmit}
      />

      <CobrarModal
        alumno={alumnoCobrar}
        isOpen={!!alumnoCobrar}
        onClose={() => setAlumnoCobrar(null)}
        onCobrar={handleCobrarSubmit}
      />

      <CobrarExtraModal
        alumno={alumnoExtra}
        isOpen={!!alumnoExtra}
        onClose={() => setAlumnoExtra(null)}
        onCobrarExtra={handleCobrarExtraSubmit}
      />

      <EditarAlumnoModal
        alumno={alumnoEditar}
        actividades={db.actividades}
        isOpen={!!alumnoEditar}
        onClose={() => setAlumnoEditar(null)}
        onSave={handleEditarAlumnoSave}
        onDelete={handleDeleteAlumno}
        onToggleBaja={handleToggleBaja}
      />

      <HistorialAlumnoModal
        alumno={alumnoHistorial}
        ingresos={db.ingresos}
        isOpen={!!alumnoHistorial}
        onClose={() => setAlumnoHistorial(null)}
        onCobrar={(alumno) => {
          setAlumnoHistorial(null);
          setAlumnoCobrar(alumno);
        }}
      />

      <PromosModal
        promo={promoEditar}
        actividades={db.actividades}
        isOpen={isPromoModalOpen}
        onClose={() => {
          setIsPromoModalOpen(false);
          setPromoEditar(null);
        }}
        onSave={handleSavePromo}
      />

      {productoVenderIdx !== null && (
        <VenderProductoModal
          producto={db.productos[productoVenderIdx]}
          productoIndex={productoVenderIdx}
          alumnos={db.alumnos}
          isOpen={true}
          onClose={() => setProductoVenderIdx(null)}
          onVender={handleVenderProductoSubmit}
        />
      )}

      <ProductoModal
        producto={productoEditarIdx !== null ? db.productos[productoEditarIdx] : null}
        isOpen={isNuevoProductoOpen}
        onClose={() => {
          setIsNuevoProductoOpen(false);
          setProductoEditarIdx(null);
        }}
        onSave={handleSaveProducto}
      />

      <GastoModal
        isOpen={isGastoModalOpen}
        onClose={() => setIsGastoModalOpen(false)}
        onAddGasto={handleAddGasto}
      />
    </div>
  );
}
