import { obtenerProductos, obtenerEmpleados } from '@/lib/actions';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

export default async function Inicio() {
  const productos = await obtenerProductos();
  const empleados = await obtenerEmpleados();

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', borderRadius: '12px', marginBottom: '2rem', color: 'white' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{getGreeting()}</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Bienvenido a novedades Michelle</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginTop: '0.5rem' }}>{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Productos en inventario</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{productos.length}</div>
        </div>

        <div className="card" style={{ textAlign: 'center', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>Empleados activos</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>{empleados.length}</div>
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
          <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Accesos Rapidos</h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <a href="/cobro" style={{ padding: '0.75rem', background: '#eff6ff', borderRadius: '8px', textDecoration: 'none', color: 'var(--primary)', fontWeight: 600, display: 'block' }}>
              Ir a Cobro
            </a>
            <a href="/inventario" style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', textDecoration: 'none', color: '#10b981', fontWeight: 600, display: 'block' }}>
              Gestionar Inventario
            </a>
            <a href="/corte-caja" style={{ padding: '0.75rem', background: '#fef3c7', borderRadius: '8px', textDecoration: 'none', color: '#f59e0b', fontWeight: 600, display: 'block' }}>
              Corte de Caja
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
