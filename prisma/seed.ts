import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const adminExists = await prisma.usuario.findUnique({ where: { username: 'admin' } });
  if (!adminExists) {
    await prisma.usuario.create({
      data: {
        username: 'admin',
        password: hashPassword('admin123'),
        nombre: 'Administrador',
        rol: 'ADMIN',
      },
    });
    console.log('Usuario admin creado (admin / admin123)');
  } else {
    console.log('Usuario admin ya existe');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
