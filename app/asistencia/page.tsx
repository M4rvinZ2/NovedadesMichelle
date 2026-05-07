import { obtenerEmpleados, obtenerAsistenciasHoy, agregarEmpleado, registrarAsistencia } from '@/lib/actions';
import AsistenciaClient from './AsistenciaClient';

export default async function Asistencia() {
  const empleados = await obtenerEmpleados();
  const asistenciasHoy = await obtenerAsistenciasHoy();
  return <AsistenciaClient empleados={empleados} asistenciasHoy={asistenciasHoy} />;
}
