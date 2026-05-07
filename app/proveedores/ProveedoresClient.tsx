'use client';

import { agregarProveedor, eliminarProveedor } from '@/lib/actions';

export default function ProveedoresClient({ proveedores }: {
  proveedores: Array<{
    id: number;
    nombre: string;
    contacto?: string | null;
    telefono?: string | null;
    email?: string | null;
    productos: Array<{ id: number }>
  }>
}) {
  return (
    <div>
      <h1 className="page-title">Proveedores</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Agregar Proveedor</h3>
        <form action={agregarProveedor}>
          <input type="text" name="nombre" placeholder="Nombre del proveedor" required />
          <input type="text" name="contacto" placeholder="Persona de contacto" />
          <input type="tel" name="telefono" placeholder="Teléfono" />
          <input type="email" name="email" placeholder="Email" />
          <button type="submit" className="btn">Agregar Proveedor</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Lista de Proveedores ({proveedores.length})</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {proveedores.map(p => (
            <div key={p.id} style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{p.nombre}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Productos: {p.productos.length}
                  </span>
                  <form action={eliminarProveedor}>
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="btn" style={{ backgroundColor: '#dc2626', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                      onClick={(e) => { if (!confirm('¿Eliminar este proveedor?')) e.preventDefault(); }}>
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
              {(p.contacto || p.telefono || p.email) && (
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                  {p.contacto && <div>Contacto: {p.contacto}</div>}
                  {p.telefono && <div>Tel: {p.telefono}</div>}
                  {p.email && <div>Email: {p.email}</div>}
                </div>
              )}
            </div>
          ))}
          {proveedores.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center' }}>No hay proveedores registrados</p>
          )}
        </div>
      </div>
    </div>
  );
}
