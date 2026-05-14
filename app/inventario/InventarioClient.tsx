'use client';

import { useState } from 'react';
import { agregarProducto, eliminarProducto, actualizarProducto } from '@/lib/actions';

export default function InventarioClient({ productos, proveedores }: {
  productos: Array<{ id: number; nombre: string; precio: number; stock: number; codigoBarras?: string | null; proveedor?: { nombre: string } | null }>,
  proveedores: Array<{ id: number; nombre: string }>
}) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editCodigo, setEditCodigo] = useState('');
  const [editProv, setEditProv] = useState('');

  const iniciarEdicion = (p: typeof productos[0]) => {
    setEditId(p.id);
    setEditNombre(p.nombre);
    setEditPrecio(p.precio.toString());
    setEditStock(p.stock.toString());
    setEditCodigo(p.codigoBarras || '');
    setEditProv(p.proveedor ? (productos.find(x => x.id === p.id) as any)?.proveedorId?.toString() || '' : '');
  };

  const guardarEdicion = async () => {
    if (editId === null) return;
    const fd = new FormData();
    fd.set('id', editId.toString());
    fd.set('nombre', editNombre);
    fd.set('precio', editPrecio);
    fd.set('stock', editStock);
    fd.set('codigoBarras', editCodigo);
    fd.set('proveedorId', editProv);
    await actualizarProducto(fd);
    setEditId(null);
  };

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
            }}>
              {editId === p.id ? (
                <div>
                  <input value={editNombre} onChange={e => setEditNombre(e.target.value)} placeholder="Nombre" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input value={editPrecio} onChange={e => setEditPrecio(e.target.value)} placeholder="Precio" style={{ marginBottom: '0.5rem' }} />
                    <input value={editStock} onChange={e => setEditStock(e.target.value)} placeholder="Stock" style={{ marginBottom: '0.5rem' }} />
                  </div>
                  <input value={editCodigo} onChange={e => setEditCodigo(e.target.value)} placeholder="Código de barras" style={{ marginBottom: '0.5rem' }} />
                  <select value={editProv} onChange={e => setEditProv(e.target.value)} style={{ marginBottom: '0.5rem' }}>
                    <option value="">Sin proveedor</option>
                    {proveedores.map(pr => <option key={pr.id} value={pr.id}>{pr.nombre}</option>)}
                  </select>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={guardarEdicion} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Guardar</button>
                    <button onClick={() => setEditId(null)} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', backgroundColor: '#64748b' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{p.nombre}</strong>
                    {p.codigoBarras && <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '1rem' }}>CB: {p.codigoBarras}</span>}
                    {p.proveedor && <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '1rem' }}>Prov: {p.proveedor.nombre}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 600, color: 'var(--primary)' }}>${p.precio}</div>
                      <div style={{ fontSize: '0.85rem', color: p.stock > 10 ? '#16a34a' : '#dc2626' }}>Stock: {p.stock}</div>
                    </div>
                    <button onClick={() => iniciarEdicion(p)} className="btn" style={{ backgroundColor: '#f59e0b', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Editar</button>
                    <form action={eliminarProducto}>
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="btn" style={{ backgroundColor: '#dc2626', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                        onClick={(e) => { if (!confirm('¿Eliminar este producto?')) e.preventDefault(); }}>
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>
              )}
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
