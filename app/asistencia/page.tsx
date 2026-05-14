import { obtenerEmpleados, obtenerAsistenciasHoy } from '@/lib/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AsistenciaClient from './AsistenciaClient';

export default async function Asistencia() {
  const session = await getSession();
  if (session?.rol !== 'ADMIN') redirect('/');

  const empleados = await obtenerEmpleados();
  const asistenciasHoy = await obtenerAsistenciasHoy();
  return <AsistenciaClient empleados={empleados} asistenciasHoy={asistenciasHoy} />;
}
