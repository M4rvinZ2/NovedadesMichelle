import { obtenerCortesCaja, obtenerVentasPendientesCorte } from '@/lib/actions';
import CorteCajaClient from './CorteCajaClient';

export default async function CorteCaja() {
  const cortes = await obtenerCortesCaja();
  const ventasPendientes = await obtenerVentasPendientesCorte();
  return <CorteCajaClient cortesIniciales={cortes} ventasPendientesIniciales={ventasPendientes} />;
}
