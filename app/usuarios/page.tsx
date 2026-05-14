import { obtenerUsuarios } from '@/lib/actions';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UsuariosClient from './UsuariosClient';

export default async function Usuarios() {
  const session = await getSession();
  if (!session || session.rol !== 'ADMIN') {
    redirect('/');
  }

  const usuarios = await obtenerUsuarios();
  return <UsuariosClient usuarios={usuarios} />;
}
