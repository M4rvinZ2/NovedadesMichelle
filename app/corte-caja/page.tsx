import { obtenerVentasPendientesCorte } from '@/lib/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CorteCajaClient from './CorteCajaClient';

export default async function CorteCaja() {
  const session = await getSession();
  if (session?.rol !== 'ADMIN') redirect('/');

  const ventasPendientes = await obtenerVentasPendientesCorte();
  return <CorteCajaClient ventasPendientesIniciales={ventasPendientes} />;
}
