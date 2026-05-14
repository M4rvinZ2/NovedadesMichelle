import { obtenerProveedores, obtenerProductos } from '@/lib/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProveedoresClient from './ProveedoresClient';

export default async function Proveedores() {
  const session = await getSession();
  if (session?.rol !== 'ADMIN') redirect('/');

  const proveedores = await obtenerProveedores();
  const productos = await obtenerProductos();
  return <ProveedoresClient proveedores={proveedores} productos={productos} />;
}
