'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/cobro', label: 'Cobro' },
    { href: '/inventario', label: 'Inventario' },
    { href: '/corte-caja', label: 'Corte de Caja' },
    { href: '/proveedores', label: 'Proveedores' },
    { href: '/asistencia', label: 'Asistencia' },
  ];

  return (
    <nav>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? 'active' : ''}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
