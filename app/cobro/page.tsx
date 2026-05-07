import { obtenerProductos } from '@/lib/actions';
import CobroClient from './CobroClient';

export default async function Cobro() {
  const productos = await obtenerProductos();
  return <CobroClient productos={productos} />;
}
