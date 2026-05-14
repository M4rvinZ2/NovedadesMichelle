'use client';

import { useState } from 'react';
import { crearUsuario, eliminarUsuario, actualizarUsuario } from '@/lib/actions';

export default function UsuariosClient({ usuarios }: {
  usuarios: Array<{ id: number; username: string; nombre: string; rol: string; createdAt: Date }>
}) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRol, setEditRol] = useState('');

  const iniciarEdicion = (u: typeof usuarios[0]) => {
    setEditId(u.id);
    setEditNombre(u.nombre);
    setEditUsername(u.username);
    setEditPassword('');
    setEditRol(u.rol);
  };

  const guardarEdicion = async () => {
    if (editId === null) return;
    const fd = new FormData();
    fd.set('id', editId.toString());
    fd.set('nombre', editNombre);
    fd.set('username', editUsername);
    fd.set('password', editPassword);
    fd.set('rol', editRol);
    await actualizarUsuario(fd);
    setEditId(null);
  };

  return (
    <div>
      <h1 className="page-title">Usuarios del Sistema</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Crear nuevo usuario</h3>
        <form action={crearUsuario}>
          <input type="text" name="nombre" placeholder="Nombre completo" required />
          <input type="text" name="username" placeholder="Nombre de usuario" required />
          <input type="password" name="password" placeholder="Contraseña" required />
          <select name="rol" required>
            <option value="EMPLEADO">Empleado</option>
            <option value="ADMIN">Administrador</option>
          </select>
          <button type="submit" className="btn">Crear Usuario</button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Usuarios registrados ({usuarios.length})</h3>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {usuarios.map(u => (
            <div key={u.id} style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}>
              {editId === u.id ? (
                <div>
                  <input value={editNombre} onChange={e => setEditNombre(e.target.value)} placeholder="Nombre" style={{ marginBottom: '0.5rem' }} />
                  <input value={editUsername} onChange={e => setEditUsername(e.target.value)} placeholder="Usuario" style={{ marginBottom: '0.5rem' }} />
                  <input value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="Nueva contraseña (dejar vacío para no cambiar)" type="password" style={{ marginBottom: '0.5rem' }} />
                  <select value={editRol} onChange={e => setEditRol(e.target.value)} style={{ marginBottom: '0.5rem' }}>
                    <option value="EMPLEADO">Empleado</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={guardarEdicion} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Guardar</button>
                    <button onClick={() => setEditId(null)} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', backgroundColor: '#64748b' }}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{u.nombre}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '1rem' }}>@{u.username}</span>
                    <span style={{
                      marginLeft: '1rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: u.rol === 'ADMIN' ? '#fef3c7' : '#dcfce7',
                      color: u.rol === 'ADMIN' ? '#d97706' : '#16a34a',
                    }}>
                      {u.rol}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(u.createdAt).toLocaleDateString('es-MX')}
                    </span>
                    <button onClick={() => iniciarEdicion(u)} className="btn" style={{ backgroundColor: '#f59e0b', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>Editar</button>
                    <form action={eliminarUsuario}>
                      <input type="hidden" name="id" value={u.id} />
                      <button type="submit" className="btn" style={{ backgroundColor: '#dc2626', padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                        onClick={(e) => { if (!confirm('¿Eliminar este usuario?')) e.preventDefault(); }}>
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))}
          {usuarios.length === 0 && (
            <p style={{ color: '#64748b', textAlign: 'center' }}>No hay usuarios registrados</p>
          )}
        </div>
      </div>
    </div>
  );
}
