import { obtenerMovimientos, obtenerProductos } from '@/lib/actions';
import MovimientosClient from './MovimientosClient';

export default async function Movimientos() {
  const { inventario, caja } = await obtenerMovimientos();
  const productos = await obtenerProductos();
  return <MovimientosClient inventario={inventario} caja={caja} productos={productos} />;
}
