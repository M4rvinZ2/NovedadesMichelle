import { obtenerProveedores, agregarProveedor } from '@/lib/actions';
import ProveedoresClient from './ProveedoresClient';

export default async function Proveedores() {
  const proveedores = await obtenerProveedores();
  return <ProveedoresClient proveedores={proveedores} />;
}
