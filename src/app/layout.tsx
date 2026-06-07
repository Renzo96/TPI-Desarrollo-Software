import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import { Toaster } from "react-hot-toast"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "StockWise - Control de Stock Automatizado",
  description: "Gestión inteligente de inventario con IA",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-[family-name:var(--font-geist-sans)] dark:bg-zinc-950 dark:text-zinc-100`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
