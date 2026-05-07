'use client';

import { useState } from 'react';

export default function CorteCajaClient({ ventasPendientesIniciales }: {
  ventasPendientesIniciales: Array<{
    id: number;
    total: number;
    createdAt: Date;
    items: Array<{
      id: number;
      cantidad: number;
      producto: { nombre: string };
    }>;
  }>
}) {
  const [ventasPendientes, setVentasPendientes] = useState(ventasPendientesIniciales);
  const [expandedVenta, setExpandedVenta] = useState<number | null>(null);

  const totalPendiente = ventasPendientes.reduce((sum: number, v: any) => sum + v.total, 0);
  const totalItemsPendiente = ventasPendientes.reduce((sum: number, v: any) => sum + v.items.reduce((s: number, i: any) => s + i.cantidad, 0), 0);

  return (
    <div>
      <h1 className="page-title">Corte de Caja</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Ventas pendientes</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{ventasPendientes.length}</div>
          <div style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>${totalPendiente.toFixed(2)}</div>
        </div>

        <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Productos pendientes</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{totalItemsPendiente}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Ventas pendientes de corte ({ventasPendientes.length})</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {ventasPendientes.map(v => (
            <div key={v.id} style={{
              padding: '1rem',
              background: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #f59e0b',
              cursor: 'pointer'
            }} onClick={() => setExpandedVenta(expandedVenta === v.id ? null : v.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>Venta #{v.id}</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>${v.total.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                {new Date(v.createdAt).toLocaleString('es-MX')}
              </div>

              {expandedVenta === v.id && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Productos:</div>
                  {v.items.map(i => (
                    <div key={i.id} style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      {i.producto.nombre} x{i.cantidad} - ${(i.cantidad * (i as any).precioUnit || 0).toFixed(2)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {ventasPendientes.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center' }}>No hay ventas pendientes</p>
          )}
        </div>
      </div>
    </div>
  );
}
