'use client';

import { useState } from 'react';
import { registrarMovimientoInventario, registrarMovimientoCaja } from '@/lib/actions';

export default function MovimientosClient({
  inventario,
  caja,
  productos,
}: {
  inventario: Array<{ id: number; tipo: string; producto: { nombre: string }; cantidad: number; motivo?: string | null; createdAt: Date }>;
  caja: Array<{ id: number; tipo: string; monto: number; concepto: string; referencia?: string | null; createdAt: Date }>;
  productos: Array<{ id: number; nombre: string }>;
}) {
  const [tab, setTab] = useState<'inventario' | 'caja'>('inventario');

  return (
    <div>
      <h1 className="page-title">Entradas y Salidas</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button
          className="btn"
          style={{ background: tab === 'inventario' ? 'var(--primary)' : '#94a3b8' }}
          onClick={() => setTab('inventario')}
        >
          Mercancía
        </button>
        <button
          className="btn"
          style={{ background: tab === 'caja' ? 'var(--primary)' : '#94a3b8' }}
          onClick={() => setTab('caja')}
        >
          Efectivo
        </button>
      </div>

      {tab === 'inventario' && (
        <>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Registrar movimiento de mercancía</h3>
            <form action={registrarMovimientoInventario}>
              <select name="tipo" required>
                <option value="">Tipo...</option>
                <option value="ENTRADA">Entrada</option>
                <option value="SALIDA">Salida</option>
              </select>
              <select name="productoId" required>
                <option value="">Seleccionar producto...</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
              <input type="number" name="cantidad" placeholder="Cantidad" min="1" required />
              <input type="text" name="motivo" placeholder="Motivo (opcional)" />
              <button type="submit" className="btn">Registrar</button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Historial ({inventario.length})</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {inventario.map(m => (
                <div key={m.id} style={{
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{m.producto.nombre}</strong>
                    {m.motivo && <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '0.5rem' }}>({m.motivo})</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: m.tipo === 'ENTRADA' ? '#dcfce7' : '#fee2e2',
                      color: m.tipo === 'ENTRADA' ? '#16a34a' : '#dc2626'
                    }}>
                      {m.tipo} {m.cantidad}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(m.createdAt).toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>
              ))}
              {inventario.length === 0 && (
                <p style={{ color: '#64748b', textAlign: 'center' }}>Sin movimientos</p>
              )}
            </div>
          </div>
        </>
      )}

      {tab === 'caja' && (
        <>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Registrar movimiento de efectivo</h3>
            <form action={registrarMovimientoCaja}>
              <select name="tipo" required>
                <option value="">Tipo...</option>
                <option value="INGRESO">Ingreso</option>
                <option value="EGRESO">Egreso</option>
              </select>
              <input type="number" name="monto" placeholder="Monto" step="0.01" min="0.01" required />
              <input type="text" name="concepto" placeholder="Concepto" required />
              <input type="text" name="referencia" placeholder="Referencia (opcional)" />
              <button type="submit" className="btn">Registrar</button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Historial ({caja.length})</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {caja.map(m => (
                <div key={m.id} style={{
                  padding: '0.75rem',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong>{m.concepto}</strong>
                    {m.referencia && <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '0.5rem' }}>({m.referencia})</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: m.tipo === 'INGRESO' ? '#dcfce7' : '#fee2e2',
                      color: m.tipo === 'INGRESO' ? '#16a34a' : '#dc2626'
                    }}>
                      {m.tipo === 'INGRESO' ? '+' : '-'} ${m.monto.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(m.createdAt).toLocaleString('es-MX')}
                    </span>
                  </div>
                </div>
              ))}
              {caja.length === 0 && (
                <p style={{ color: '#64748b', textAlign: 'center' }}>Sin movimientos</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
