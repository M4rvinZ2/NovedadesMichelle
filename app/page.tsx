import { obtenerProductos, obtenerEmpleadosActivosHoy } from '@/lib/actions';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export default async function Inicio() {
  const productos = await obtenerProductos();
  const empleadosActivos = await obtenerEmpleadosActivosHoy();
  const session = await getSession();
  const isAdmin = session?.rol === 'ADMIN';

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', borderRadius: '12px', marginBottom: '2rem', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{getGreeting()}{session ? `, ${session.nombre}` : ''}</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Sistema de Venta de Temporada</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Productos en inventario</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{productos.length}</div>
        </div>

        <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Empleados activos hoy</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>{empleadosActivos}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {productos.filter((p: any) => p.stock < 10).length > 0 && (
          <div className="card">
            <h3 style={{ color: '#dc2626', marginBottom: '1rem' }}>Stock Bajo</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {productos.filter((p: any) => p.stock < 10).map((p: any) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: '#fee2e2', borderRadius: '6px' }}>
                  <span>{p.nombre}</span>
                  <span style={{ fontWeight: 600, color: '#dc2626' }}>Stock: {p.stock}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Accesos Rápidos</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <Link href="/cobro" style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '8px', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600, display: 'block' }}>
              Ir a Cobro
            </Link>
            <Link href="/inventario" style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', textDecoration: 'none', color: '#10b981', fontWeight: 600, display: 'block' }}>
              Gestionar Inventario
            </Link>
            <Link href="/movimientos" style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '8px', textDecoration: 'none', color: '#d97706', fontWeight: 600, display: 'block' }}>
              Entradas y Salidas
            </Link>
            {isAdmin && (
              <Link href="/corte-caja" style={{ padding: '0.75rem', background: '#e0e7ff', borderRadius: '8px', textDecoration: 'none', color: '#4f46e5', fontWeight: 600, display: 'block' }}>
                Corte de Caja
              </Link>
            )}
            {isAdmin && (
              <Link href="/proveedores" style={{ padding: '0.75rem', background: '#fce7f3', borderRadius: '8px', textDecoration: 'none', color: '#db2777', fontWeight: 600, display: 'block' }}>
                Proveedores
              </Link>
            )}
            {isAdmin && (
              <Link href="/asistencia" style={{ padding: '0.75rem', background: '#d1fae5', borderRadius: '8px', textDecoration: 'none', color: '#059669', fontWeight: 600, display: 'block' }}>
                Asistencia
              </Link>
            )}
            {isAdmin && (
              <Link href="/usuarios" style={{ padding: '0.75rem', background: '#f3e8ff', borderRadius: '8px', textDecoration: 'none', color: '#7c3aed', fontWeight: 600, display: 'block' }}>
                Usuarios del Sistema
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
