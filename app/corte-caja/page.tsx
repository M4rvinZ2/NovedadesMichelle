import { obtenerVentasPendientesCorte } from '@/lib/actions';
import CorteCajaClient from './CorteCajaClient';

export default async function CorteCaja() {
  const ventasPendientes = await obtenerVentasPendientesCorte();
  return <CorteCajaClient ventasPendientesIniciales={ventasPendientes} />;
}
