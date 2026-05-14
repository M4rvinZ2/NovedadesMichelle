import type { Metadata } from "next";
import Nav from "@/components/Nav";
import { Inter } from "next/font/google";
import { getSession } from "@/lib/auth";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema Venta Temporada",
  description: "Sistema de venta para tienda",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="es">
      <body className={inter.className}>
        <Nav usuario={session ? { nombre: session.nombre, rol: session.rol } : null} />
        <main>{children}</main>
      </body>
    </html>
  );
}
