'use client';

import { useState } from 'react';
import { agregarProveedor, eliminarProveedor, actualizarProveedor, registrarCompra } from '@/lib/actions';

export default function ProveedoresClient({
  proveedores,
  productos,
}: {
  proveedores: Array<{
    id: number;
    nombre: string;
    contacto?: string | null;
    telefono?: string | null;
    email?: string | null;
    productos: Array<{ id: number }>;
    compras: Array<{
      id: number;
      total: number;
      createdAt: Date;
      items: Array<{
        id: number;
        cantidad: number;
        precioUnit: number;
        producto: { nombre: string };
      }>;
    }>;
  }>;
  productos: Array<{ id: number; nombre: string; precio: number }>;
}) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editContacto, setEditContacto] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [compraProveedorId, setCompraProveedorId] = useState<number | null>(null);
  const [compraItems, setCompraItems] = useState<Array<{ productoId: number; nombre: string; cantidad: number; precioUnit: number }>>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [compraCantidad, setCompraCantidad] = useState(1);
  const [compraPrecio, setCompraPrecio] = useState('');

  const iniciarEdicion = (p: typeof proveedores[0]) => {
    setEditId(p.id);
    setEditNombre(p.nombre);
    setEditContacto(p.contacto || '');
    setEditTelefono(p.telefono || '');
    setEditEmail(p.email || '');
  };

  const guardarEdicion = async () => {
    if (editId === null) return;
    const fd = new FormData();
    fd.set('id', editId.toString());
    fd.set('nombre', editNombre);
    fd.set('contacto', editContacto);
    fd.set('telefono', editTelefono);
    fd.set('email', editEmail);
    await actualizarProveedor(fd);
    setEditId(null);
  };

  const agregarItemCompra = () => {
    const pid = parseInt(selectedProduct);
    const prod = productos.find(p => p.id === pid);
    if (!prod || !compraPrecio) return;
    setCompraItems(prev => {
      const existing = prev.find(i => i.productoId === pid);
      if (existing) {
        return prev.map(i => i.productoId === pid ? { ...i, cantidad: i.cantidad + compraCantidad, precioUnit: parseFloat(compraPrecio) } : i);
      }
      return [...prev, { productoId: pid, nombre: prod.nombre, cantidad: compraCantidad, precioUnit: parseFloat(compraPrecio) }];
    });
    setSelectedProduct('');
    setCompraCantidad(1);
    setCompraPrecio('');
  };

  const totalCompra = compraItems.reduce((s, i) => s + i.cantidad * i.precioUnit, 0);

  const guardarCompra = async () => {
    if (compraProveedorId === null || compraItems.length === 0) return;
    const fd = new FormData();
    fd.set('proveedorId', compraProveedorId.toString());
    fd.set('items', JSON.stringify(compraItems.map(({ productoId, cantidad, precioUnit }) => ({ productoId, cantidad, precioUnit }))));
    await registrarCompra(fd);
    setCompraItems([]);
    setCompraProveedorId(null);
  };

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

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Registrar Compra a Proveedor</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <select value={compraProveedorId ?? ''} onChange={e => setCompraProveedorId(e.target.value ? parseInt(e.target.value) : null)}>
            <option value="">Seleccionar proveedor...</option>
            {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          {compraProveedorId !== null && (
            <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
              <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ marginBottom: '0.5rem' }}>
                <option value="">Seleccionar producto...</option>
                {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input type="number" value={compraCantidad} onChange={e => setCompraCantidad(parseInt(e.target.value) || 1)} placeholder="Cantidad" min="1" style={{ marginBottom: 0 }} />
                <input type="number" value={compraPrecio} onChange={e => setCompraPrecio(e.target.value)} placeholder="Precio unit." step="0.01" style={{ marginBottom: 0 }} />
              </div>
              <button onClick={agregarItemCompra} className="btn" style={{ width: '100%' }}>Agregar a la compra</button>
              {compraItems.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  {compraItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', fontSize: '0.9rem' }}>
                      <span>{item.nombre} x{item.cantidad}</span>
                      <span>${(item.cantidad * item.precioUnit).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ fontWeight: 600, marginTop: '0.5rem' }}>Total: ${totalCompra.toFixed(2)}</div>
                  <button onClick={guardarCompra} className="btn" style={{ width: '100%', marginTop: '0.5rem', backgroundColor: '#10b981' }}>Guardar Compra</button>
                </div>
              )}
            </div>
          )}
        </div>
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
              {editId === p.id ? (
                <div>
                  <input value={editNombre} onChange={e => setEditNombre(e.target.value)} placeholder="Nombre" style={{ marginBottom: '0.5rem' }} />
                  <input value={editContacto} onChange={e => setEditContacto(e.target.value)} placeholder="Contacto" style={{ marginBottom: '0.5rem' }} />
                  <input value={editTelefono} onChange={e => setEditTelefono(e.target.value)} placeholder="Teléfono" style={{ marginBottom: '0.5rem' }} />
                  <input value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="Email" style={{ marginBottom: '0.5rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={guardarEdicion} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Guardar</button>
                    <button onClick={() => setEditId(null)} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', backgroundColor: '#64748b' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>{p.nombre}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Productos: {p.productos.length} | Compras: {p.compras.length}
                      </span>
                      <button onClick={() => iniciarEdicion(p)} className="btn" style={{ backgroundColor: '#f59e0b', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Editar</button>
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
                  {p.compras.length > 0 && (
                    <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-dark)' }}>Compras registradas:</span>
                      {p.compras.map(c => (
                        <div key={c.id} style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem', padding: '0.5rem', background: '#f1f5f9', borderRadius: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Compra #{c.id} - {new Date(c.createdAt).toLocaleDateString('es-MX')}</span>
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>${c.total.toFixed(2)}</span>
                          </div>
                          <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                            {c.items.map(i => (
                              <div key={i.id}>{i.producto.nombre} x{i.cantidad} - ${(i.cantidad * i.precioUnit).toFixed(2)}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
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
