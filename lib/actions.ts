'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

export async function agregarProducto(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const precio = parseFloat(formData.get('precio') as string);
  const stock = parseInt(formData.get('stock') as string) || 0;
  const codigoBarras = formData.get('codigoBarras') as string || undefined;
  const proveedorId = formData.get('proveedorId') ? parseInt(formData.get('proveedorId') as string) : undefined;

  await prisma.producto.create({
    data: { nombre, precio, stock, codigoBarras, proveedorId }
  });

  revalidatePath('/inventario');
}

export async function agregarProveedor(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const contacto = formData.get('contacto') as string || undefined;
  const telefono = formData.get('telefono') as string || undefined;
  const email = formData.get('email') as string || undefined;

  await prisma.proveedor.create({
    data: { nombre, contacto, telefono, email }
  });

  revalidatePath('/proveedores');
}

export async function agregarEmpleado(formData: FormData) {
  const codigo = formData.get('codigo') as string;
  const nombre = formData.get('nombre') as string;
  const puesto = formData.get('puesto') as string || undefined;

  await prisma.empleado.create({
    data: { codigo, nombre, puesto }
  });

  revalidatePath('/asistencia');
}

export async function eliminarEmpleado(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await prisma.asistencia.deleteMany({ where: { empleadoId: id } });
  await prisma.empleado.delete({ where: { id } });
  revalidatePath('/asistencia');
}

export async function eliminarProducto(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const hasVentas = await prisma.ventaItem.findFirst({ where: { productoId: id } });
  if (hasVentas) return;
  await prisma.producto.delete({ where: { id } });
  revalidatePath('/inventario');
}

export async function eliminarProveedor(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await prisma.producto.updateMany({ where: { proveedorId: id }, data: { proveedorId: null } });
  await prisma.proveedor.delete({ where: { id } });
  revalidatePath('/proveedores');
}

export async function registrarAsistencia(formData: FormData) {
  'use server';

  const codigo = formData.get('codigo') as string;
  const tipo = formData.get('tipo') as string;

  const empleado = await prisma.empleado.findUnique({
    where: { codigo }
  });

  if (!empleado) return;

  await prisma.asistencia.create({
    data: {
      empleadoId: empleado.id,
      tipo
    }
  });

  revalidatePath('/asistencia');
}

export async function realizarVenta(formData: FormData) {
  const items = JSON.parse(formData.get('items') as string);

  const total = items.reduce((sum: number, item: any) => sum + item.cantidad * item.precioUnit, 0);

  await prisma.venta.create({
    data: {
      total,
      items: {
        create: items.map((item: any) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnit: item.precioUnit
        }))
      }
    }
  });

  for (const item of items) {
    await prisma.producto.update({
      where: { id: item.productoId },
      data: { stock: { decrement: item.cantidad } }
    });
  }

  revalidatePath('/');
}

export async function obtenerProductos() {
  return await prisma.producto.findMany({
    include: { proveedor: true }
  });
}

export async function obtenerProveedores() {
  return await prisma.proveedor.findMany({
    include: { productos: true }
  });
}

export async function obtenerEmpleados() {
  return await prisma.empleado.findMany({
    include: { asistencias: true }
  });
}

export async function obtenerAsistenciasHoy() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  return await prisma.asistencia.findMany({
    where: {
      fecha: {
        gte: hoy,
        lt: manana
      }
    },
    include: { empleado: true }
  });
}

export async function obtenerVentasPendientesCorte() {
  return await prisma.venta.findMany({
    include: { items: { include: { producto: true } } }
  });
}
