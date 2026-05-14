import { obtenerProductos, obtenerEmpleados } from '@/lib/actions';
import CobroClient from './CobroClient';

export default async function Cobro() {
  const productos = await obtenerProductos();
  const empleados = await obtenerEmpleados();
  return <CobroClient productos={productos} empleados={empleados} />;
}
