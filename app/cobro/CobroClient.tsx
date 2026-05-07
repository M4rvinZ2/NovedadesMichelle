'use client';

import { useState } from 'react';
import { realizarVenta } from '@/lib/actions';

export default function CobroClient({ productos }: { productos: Array<{ id: number; nombre: string; precio: number; stock: number }> }) {
  const [cart, setCart] = useState<Array<{ productoId: number; nombre: string; cantidad: number; precioUnit: number }>>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [cantidad, setCantidad] = useState(1);

  const agregarAlCarrito = () => {
    const productoId = parseInt(selectedProduct);
    const producto = productos.find(p => p.id === productoId);

    if (!producto || cantidad <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.productoId === productoId);
      if (existing) {
        return prev.map(item =>
          item.productoId === productoId
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...prev, { productoId, nombre: producto.nombre, cantidad, precioUnit: producto.precio }];
    });

    setSelectedProduct('');
    setCantidad(1);
  };

  const total = cart.reduce((sum, item) => sum + item.cantidad * item.precioUnit, 0);

  const pagar = async () => {
    if (cart.length === 0) return;

    const formData = new FormData();
    formData.set('items', JSON.stringify(cart.map(({ productoId, cantidad, precioUnit }) => ({ productoId, cantidad, precioUnit }))));
    await realizarVenta(formData);
    setCart([]);
  };

  return (
    <div>
      <h1 className="page-title">Cobro</h1>
      <div className="card">
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>Sistema de cobro y ventas</p>

        <div style={{ marginBottom: '1rem' }}>
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            style={{ marginBottom: '1rem', display: 'block', width: '100%', padding: '0.5rem' }}
          >
            <option value="">Seleccionar producto...</option>
            {productos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} - ${p.precio} (Stock: {p.stock})
              </option>
            ))}
          </select>

          <input
            type="number"
            value={cantidad}
            onChange={e => setCantidad(parseInt(e.target.value) || 1)}
            placeholder="Cantidad"
            min="1"
            style={{ marginBottom: '1rem', display: 'block', width: '100%', padding: '0.5rem' }}
          />
          <button onClick={agregarAlCarrito} className="btn" style={{ width: '100%' }}>Agregar al carrito</button>
        </div>

        {cart.length > 0 && (
          <div style={{ marginTop: '2rem', border: '1px solid var(--border)', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Carrito</h3>
            {cart.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <span>{item.nombre} x{item.cantidad}</span>
                <span>${(item.cantidad * item.precioUnit).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: '1rem', fontSize: '1.1rem' }}>
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button onClick={pagar} className="btn" style={{ width: '100%', marginTop: '1rem', backgroundColor: '#10b981' }}>
              Pagar
            </button>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Productos disponibles</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {productos.map(p => (
              <div key={p.id} style={{
                padding: '0.75rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{p.nombre}</span>
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  ${p.precio} | Stock: {p.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
