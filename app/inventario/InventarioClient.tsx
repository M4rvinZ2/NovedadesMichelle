'use client';

import { agregarProducto, eliminarProducto } from '@/lib/actions';

export default function InventarioClient({ productos, proveedores }: {
  productos: Array<{ id: number; nombre: string; precio: number; stock: number; codigoBarras?: string | null; proveedor?: { nombre: string } | null }>,
  proveedores: Array<{ id: number; nombre: string }>
}) {
  return (
    <div>
      <h1 className="page-title">Inventario</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Agregar Producto</h3>
        <form action={agregarProducto}>
          <input type="text" name="nombre" placeholder="Nombre del producto" required />
          <input type="number" name="precio" placeholder="Precio" step="0.01" required />
          <input type="number" name="stock" placeholder="Stock inicial" />
          <input type="text" name="codigoBarras" placeholder="Código de barras (opcional)" />
          <select name="proveedorId">
            <option value="">Sin proveedor</option>
            {proveedores.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
          <button type="submit" className="btn">Agregar Producto</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Lista de Productos ({productos.length})</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {productos.map(p => (
            <div key={p.id} style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>{p.nombre}</strong>
                {p.codigoBarras && <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '1rem' }}>CB: {p.codigoBarras}</span>}
                {p.proveedor && <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '1rem' }}>Prov: {p.proveedor.nombre}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600, color: 'var(--primary)' }}>${p.precio}</div>
                  <div style={{ fontSize: '0.85rem', color: p.stock > 10 ? '#16a34a' : '#dc2626' }}>
                    Stock: {p.stock}
                  </div>
                </div>
                <form action={eliminarProducto}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit" className="btn" style={{ backgroundColor: '#dc2626', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                    onClick={(e) => { if (!confirm('¿Eliminar este producto?')) e.preventDefault(); }}>
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
          {productos.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center' }}>No hay productos registrados</p>
          )}
        </div>
      </div>
    </div>
  );
}
