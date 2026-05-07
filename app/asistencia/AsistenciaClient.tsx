'use client';

import { agregarEmpleado, registrarAsistencia, eliminarEmpleado } from '@/lib/actions';

export default function AsistenciaClient({ empleados, asistenciasHoy }: {
  empleados: Array<{ id: number; nombre: string; codigo: string; puesto?: string | null }>,
  asistenciasHoy: Array<{ id: number; tipo: string; fecha: Date; empleado: { nombre: string; codigo: string } }>
}) {
  return (
    <div>
      <h1 className="page-title">Asistencia de Empleados</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Registrar Empleado</h3>
        <form action={agregarEmpleado}>
          <input type="text" name="codigo" placeholder="Código de empleado" required />
          <input type="text" name="nombre" placeholder="Nombre completo" required />
          <input type="text" name="puesto" placeholder="Puesto (opcional)" />
          <button type="submit" className="btn">Agregar Empleado</button>
        </form>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Registrar Entrada/Salida</h3>
        <form action={registrarAsistencia}>
          <input type="text" name="codigo" placeholder="ID/Código de empleado" required />
          <select name="tipo" required>
            <option value="">Seleccionar tipo...</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SALIDA">Salida</option>
          </select>
          <button type="submit" className="btn">Registrar</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Asistencias de hoy ({asistenciasHoy.length})</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {asistenciasHoy.map(a => (
            <div key={a.id} style={{
              padding: '0.75rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{a.empleado.nombre} ({a.empleado.codigo})</span>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  background: a.tipo === 'ENTRADA' ? '#dcfce7' : '#fee2e2',
                  color: a.tipo === 'ENTRADA' ? '#16a34a' : '#dc2626'
                }}>
                  {a.tipo}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  {new Date(a.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {asistenciasHoy.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center' }}>No hay registros hoy</p>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Empleados registrados ({empleados.length})</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {empleados.map(e => (
            <div key={e.id} style={{
              padding: '0.75rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>{e.nombre}</strong> - {e.codigo}
                {e.puesto && <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '1rem' }}>{e.puesto}</span>}
              </div>
              <form action={eliminarEmpleado}>
                <input type="hidden" name="id" value={e.id} />
                <button type="submit" className="btn" style={{ backgroundColor: '#dc2626', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                  onClick={(ev) => { if (!confirm('¿Eliminar este empleado?')) ev.preventDefault(); }}>
                  Eliminar
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
