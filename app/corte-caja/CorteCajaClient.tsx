'use client';

import { useState } from 'react';
import { realizarCorteCaja } from '@/lib/actions';

export default function CorteCajaClient({ cortesIniciales, ventasPendientesIniciales }: {
  cortesIniciales: Array<{
    id: number;
    fecha: Date;
    totalVentas: number;
    numeroVentas: number;
    ventas: Array<{
      id: number;
      total: number;
      items: Array<{
        id: number;
        cantidad: number;
        precioUnit: number;
        producto: { nombre: string };
      }>;
    }>;
  }>,
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
  const [cortes, setCortes] = useState(cortesIniciales);
  const [ventasPendientes, setVentasPendientes] = useState(ventasPendientesIniciales);
  const [expandedCorte, setExpandedCorte] = useState<number | null>(null);

  const totalPendiente = ventasPendientes.reduce((sum, v) => sum + v.total, 0);
  const totalItemsPendiente = ventasPendientes.reduce((sum, v) => sum + v.items.reduce((s, i) => s + i.cantidad, 0), 0);

  const handleCorteCaja = async () => {
    if (ventasPendientes.length === 0) {
      alert('No hay ventas pendientes para realizar el corte');
      return;
    }
    const confirmed = window.confirm('¿Está seguro de realizar el corte de caja? Esta acción guardará las ventas pendientes.');
    if (confirmed) {
      await realizarCorteCaja();
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 className="page-title">Corte de Caja</h1>

      <button onClick={handleCorteCaja} className="btn" style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#f59e0b' }}>
        Realizar Corte de Caja
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Pendiente de corte</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>${totalPendiente.toFixed(2)}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Ventas pendientes</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{ventasPendientes.length}</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Productos pendientes</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{totalItemsPendiente}</div>
        </div>
      </div>

      {ventasPendientes.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Ventas pendientes de corte ({ventasPendientes.length})</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {ventasPendientes.map(v => (
              <div key={v.id} style={{
                padding: '1rem',
                background: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #f59e0b'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>Venta #{v.id}</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>${v.total.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {v.items.map(i => (
                    <span key={i.id} style={{ marginRight: '1rem' }}>
                      {i.producto.nombre} x{i.cantidad}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  {new Date(v.createdAt).toLocaleString('es-MX')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Historial de Cortes ({cortes.length})</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {cortes.map(corte => (
            <div key={corte.id} style={{
              padding: '1rem',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #10b981',
              cursor: 'pointer'
            }} onClick={() => setExpandedCorte(expandedCorte === corte.id ? null : corte.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>Corte #{corte.id} - Click para ver detalles</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>${corte.totalVentas.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
                {corte.numeroVentas} venta(s) | {new Date(corte.fecha).toLocaleString('es-MX')}
              </div>

              {expandedCorte === corte.id && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#dcfce7', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ventas en este corte:</div>
                  {corte.ventas.map(v => (
                    <div key={v.id} style={{ marginBottom: '0.75rem', padding: '0.5rem', background: 'white', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600 }}>Venta #{v.id}</span>
                        <span>${v.total.toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {v.items.map(i => (
                          <div key={i.id}>
                            {i.producto.nombre} x{i.cantidad} - ${(i.cantidad * i.precioUnit).toFixed(2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {cortes.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center' }}>No hay cortes registrados</p>
          )}
        </div>
      </div>
    </div>
  );
}
