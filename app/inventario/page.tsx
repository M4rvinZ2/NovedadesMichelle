import { obtenerProductos, obtenerProveedores, agregarProducto } from '@/lib/actions';
import InventarioClient from './InventarioClient';

export default async function Inventario() {
  const productos = await obtenerProductos();
  const proveedores = await obtenerProveedores();
  return <InventarioClient productos={productos} proveedores={proveedores} />;
}
