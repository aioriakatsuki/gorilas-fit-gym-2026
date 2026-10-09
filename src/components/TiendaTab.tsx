import React, { useState } from 'react';
import { Producto } from '../types';
import { ShoppingBag, Plus, Edit2, AlertCircle, Package } from 'lucide-react';

interface Props {
  productos: Producto[];
  onVenderProducto: (index: number) => void;
  onNuevoProducto: () => void;
  onEditarProducto: (index: number) => void;
  onRestock: (index: number, delta: number) => void;
}

export const TiendaTab: React.FC<Props> = ({
  productos,
  onVenderProducto,
  onNuevoProducto,
  onEditarProducto,
  onRestock,
}) => {
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');

  const categorias = Array.from(
    new Set(productos.map((p) => p.categoria).filter(Boolean) as string[])
  );

  const productosFiltrados = productos.filter((p) => {
    if (categoriaFiltro === 'todas') return true;
    return p.categoria === categoriaFiltro;
  });

  const totalStockItems = productos.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="space-y-3 pb-24">
      {/* Category filters */}
      {categorias.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setCategoriaFiltro('todas')}
            className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
              categoriaFiltro === 'todas'
                ? 'bg-white text-black'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Todos ({productos.length})
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaFiltro(cat)}
              className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
                categoriaFiltro === cat
                  ? 'bg-yellow-400 text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid of products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {productosFiltrados.map((p, idx) => {
          const originalIdx = productos.indexOf(p);
          const gananciaUnidad = p.venta - p.costo;
          const isLowStock = p.stock <= 5;

          return (
            <div
              key={idx}
              className="bg-[#161920] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between transition hover:border-yellow-400/40 shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start gap-1">
                  <div>
                    <b className="text-sm font-black text-white">{p.nombre}</b>
                    {p.categoria && (
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">
                        {p.categoria}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onEditarProducto(originalIdx)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
                    title="Editar producto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Price & profit specs */}
                <div className="mt-2 text-xs space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Precio Venta:</span>
                    <span className="font-mono font-black text-yellow-400 text-sm">${p.venta} MXN</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span>Costo: ${p.costo}</span>
                    <span className="text-emerald-400 font-semibold">+${gananciaUnidad} ganancia</span>
                  </div>
                </div>

                {/* Stock Indicator */}
                <div className="mt-2.5 flex items-center justify-between bg-[#101217] px-2.5 py-1.5 rounded-xl border border-white/5">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    Stock:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-mono font-black ${
                        isLowStock ? 'text-red-400' : 'text-white'
                      }`}
                    >
                      {p.stock} pzas
                    </span>
                    <button
                      onClick={() => onRestock(originalIdx, 5)}
                      title="Agregar +5 al inventario"
                      className="text-[10px] bg-white/10 hover:bg-white/20 text-gray-200 px-1.5 py-0.5 rounded font-bold"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>

              {/* Sell button */}
              <button
                onClick={() => onVenderProducto(originalIdx)}
                disabled={p.stock <= 0}
                className="w-full mt-3 bg-white hover:bg-yellow-400 hover:text-black text-black py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow active:scale-[0.98] disabled:opacity-40 disabled:hover:bg-white"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {p.stock > 0 ? 'VENDER' : 'AGOTADO'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add new product button */}
      <button
        onClick={onNuevoProducto}
        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4 text-yellow-400" />
        + Nuevo Producto en Tienda
      </button>
    </div>
  );
};
