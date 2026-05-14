'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/actions';

export default function Nav({ usuario }: { usuario: { nombre: string; rol: string } | null }) {
  const pathname = usePathname();

  const allLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/cobro', label: 'Cobro' },
    { href: '/inventario', label: 'Inventario' },
    { href: '/movimientos', label: 'Ent/Sal' },
    { href: '/corte-caja', label: 'Corte Caja' },
    { href: '/proveedores', label: 'Proveedores' },
    { href: '/asistencia', label: 'Asistencia' },
    { href: '/usuarios', label: 'Usuarios', adminOnly: true },
  ];

  const links = allLinks.filter(link => {
    if (!usuario) return false;
    if (link.adminOnly) return usuario.rol === 'ADMIN';
    if (usuario.rol === 'ADMIN') return true;
    const empLinks = ['/', '/cobro', '/inventario', '/movimientos'];
    return empLinks.includes(link.href);
  });

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {usuario && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
              {usuario.nombre} ({usuario.rol})
            </span>
            <form action={logout}>
              <button type="submit" style={{
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}>
                Cerrar sesión
              </button>
            </form>
          </>
        )}
      </div>
    </nav>
  );
}
