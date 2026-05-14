import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  await prisma.movimientoInventario.deleteMany({});
  await prisma.movimientoCaja.deleteMany({});
  await prisma.compraItem.deleteMany({});
  await prisma.compra.deleteMany({});
  await prisma.ventaItem.deleteMany({});
  await prisma.venta.deleteMany({});
  await prisma.asistencia.deleteMany({});
  await prisma.producto.deleteMany({});
  await prisma.proveedor.deleteMany({});
  await prisma.empleado.deleteMany({});
  await prisma.usuario.deleteMany({});

  await prisma.usuario.create({
    data: {
      username: 'admin',
      password: hashPassword('admin123'),
      nombre: 'Administrador',
      rol: 'ADMIN',
    },
  });

  console.log('Base de datos reiniciada. Usuario admin creado (admin / admin123)');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
