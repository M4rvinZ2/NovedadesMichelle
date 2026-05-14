'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { hashPassword, verifyPassword, createSession } from './auth';
import { cookies } from 'next/headers';

// ─── Auth ──────────────────────────────────────────────

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const usuario = await prisma.usuario.findUnique({ where: { username } });
  if (!usuario || !verifyPassword(password, usuario.password)) {
    return { error: 'Usuario o contraseña incorrectos' };
  }

  const cookieStore = await cookies();
  cookieStore.set('session', createSession(usuario), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  revalidatePath('/');
}

export async function crearUsuario(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const nombre = formData.get('nombre') as string;
  const rol = formData.get('rol') as string || 'EMPLEADO';

  const hashed = hashPassword(password);

  await prisma.usuario.create({
    data: { username, password: hashed, nombre, rol },
  });

  revalidatePath('/usuarios');
}

export async function eliminarUsuario(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await prisma.usuario.delete({ where: { id } });
  revalidatePath('/usuarios');
}

export async function actualizarUsuario(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const nombre = formData.get('nombre') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const rol = formData.get('rol') as string;

  const data: any = { nombre, username, rol };
  if (password) {
    data.password = hashPassword(password);
  }

  await prisma.usuario.update({ where: { id }, data });
  revalidatePath('/usuarios');
}

export async function obtenerUsuarios() {
  return await prisma.usuario.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

// ─── Productos ─────────────────────────────────────────

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

export async function eliminarProducto(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const hasVentas = await prisma.ventaItem.findFirst({ where: { productoId: id } });
  if (hasVentas) return;
  await prisma.producto.delete({ where: { id } });
  revalidatePath('/inventario');
}

export async function actualizarProducto(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const nombre = formData.get('nombre') as string;
  const precio = parseFloat(formData.get('precio') as string);
  const stock = parseInt(formData.get('stock') as string) || 0;
  const codigoBarras = formData.get('codigoBarras') as string || undefined;
  const proveedorId = formData.get('proveedorId') ? parseInt(formData.get('proveedorId') as string) : undefined;

  await prisma.producto.update({
    where: { id },
    data: { nombre, precio, stock, codigoBarras, proveedorId }
  });
  revalidatePath('/inventario');
}

export async function obtenerProductos() {
  return await prisma.producto.findMany({
    include: { proveedor: true }
  });
}

// ─── Proveedores ───────────────────────────────────────

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

export async function eliminarProveedor(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  await prisma.producto.updateMany({ where: { proveedorId: id }, data: { proveedorId: null } });
  await prisma.proveedor.delete({ where: { id } });
  revalidatePath('/proveedores');
}

export async function actualizarProveedor(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const nombre = formData.get('nombre') as string;
  const contacto = formData.get('contacto') as string || undefined;
  const telefono = formData.get('telefono') as string || undefined;
  const email = formData.get('email') as string || undefined;

  await prisma.proveedor.update({
    where: { id },
    data: { nombre, contacto, telefono, email }
  });
  revalidatePath('/proveedores');
}

export async function obtenerProveedores() {
  return await prisma.proveedor.findMany({
    include: { productos: true, compras: { include: { items: { include: { producto: true } } } } }
  });
}

// ─── Compras a proveedores ─────────────────────────────

export async function registrarCompra(formData: FormData) {
  const proveedorId = parseInt(formData.get('proveedorId') as string);
  const items = JSON.parse(formData.get('items') as string);

  const total = items.reduce((sum: number, item: any) => sum + item.cantidad * item.precioUnit, 0);

  await prisma.compra.create({
    data: {
      proveedorId,
      total,
      items: {
        create: items.map((item: any) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnit: item.precioUnit,
        })),
      },
    },
  });

  for (const item of items) {
    await prisma.producto.update({
      where: { id: item.productoId },
      data: { stock: { increment: item.cantidad } },
    });
  }

  revalidatePath('/proveedores');
}

// ─── Empleados ─────────────────────────────────────────

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
  await prisma.venta.updateMany({ where: { vendedorId: id }, data: { vendedorId: null } });
  await prisma.empleado.delete({ where: { id } });
  revalidatePath('/asistencia');
}

export async function actualizarEmpleado(formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const codigo = formData.get('codigo') as string;
  const nombre = formData.get('nombre') as string;
  const puesto = formData.get('puesto') as string || undefined;

  await prisma.empleado.update({
    where: { id },
    data: { codigo, nombre, puesto }
  });
  revalidatePath('/asistencia');
}

// ─── Reset ─────────────────────────────────────────────

export async function limpiarRegistros() {
  await prisma.movimientoInventario.deleteMany({});
  await prisma.movimientoCaja.deleteMany({});
  await prisma.compraItem.deleteMany({});
  await prisma.compra.deleteMany({});
  await prisma.ventaItem.deleteMany({});
  await prisma.venta.deleteMany({});
  await prisma.asistencia.deleteMany({});
  revalidatePath('/');
}

export async function obtenerEmpleados() {
  return await prisma.empleado.findMany({
    include: { asistencias: true }
  });
}

export async function obtenerEmpleadosActivosHoy() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  const asistencias = await prisma.asistencia.findMany({
    where: { fecha: { gte: hoy, lt: manana }, tipo: 'ENTRADA' },
    distinct: ['empleadoId'],
  });
  return asistencias.length;
}

// ─── Asistencia ────────────────────────────────────────

export async function registrarAsistencia(formData: FormData) {
  const codigo = formData.get('codigo') as string;
  const tipo = formData.get('tipo') as string;

  const empleado = await prisma.empleado.findUnique({ where: { codigo } });
  if (!empleado) return;

  await prisma.asistencia.create({
    data: { empleadoId: empleado.id, tipo }
  });

  revalidatePath('/asistencia');
}

export async function obtenerAsistenciasHoy() {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(manana.getDate() + 1);

  return await prisma.asistencia.findMany({
    where: { fecha: { gte: hoy, lt: manana } },
    include: { empleado: true }
  });
}

// ─── Ventas ────────────────────────────────────────────

export async function realizarVenta(formData: FormData) {
  const items = JSON.parse(formData.get('items') as string);
  const vendedorId = formData.get('vendedorId') ? parseInt(formData.get('vendedorId') as string) : undefined;

  const total = items.reduce((sum: number, item: any) => sum + item.cantidad * item.precioUnit, 0);

  await prisma.venta.create({
    data: {
      total,
      vendedorId,
      items: {
        create: items.map((item: any) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnit: item.precioUnit,
        })),
      },
    },
  });

  for (const item of items) {
    await prisma.producto.update({
      where: { id: item.productoId },
      data: { stock: { decrement: item.cantidad } },
    });
  }

  revalidatePath('/');
}

export async function obtenerVentasPendientesCorte() {
  return await prisma.venta.findMany({
    include: { items: { include: { producto: true } }, vendedor: true }
  });
}

// ─── Movimientos (Entradas/Salidas) ────────────────────

export async function registrarMovimientoInventario(formData: FormData) {
  const tipo = formData.get('tipo') as string;
  const productoId = parseInt(formData.get('productoId') as string);
  const cantidad = parseInt(formData.get('cantidad') as string);
  const motivo = formData.get('motivo') as string || undefined;

  await prisma.movimientoInventario.create({
    data: { tipo, productoId, cantidad, motivo },
  });

  await prisma.producto.update({
    where: { id: productoId },
    data: { stock: { [tipo === 'ENTRADA' ? 'increment' : 'decrement']: cantidad } },
  });

  revalidatePath('/movimientos');
}

export async function registrarMovimientoCaja(formData: FormData) {
  const tipo = formData.get('tipo') as string;
  const monto = parseFloat(formData.get('monto') as string);
  const concepto = formData.get('concepto') as string;
  const referencia = formData.get('referencia') as string || undefined;

  await prisma.movimientoCaja.create({
    data: { tipo, monto, concepto, referencia },
  });

  revalidatePath('/movimientos');
}

export async function obtenerMovimientos() {
  const inventario = await prisma.movimientoInventario.findMany({
    include: { producto: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  const caja = await prisma.movimientoCaja.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  return { inventario, caja };
}
