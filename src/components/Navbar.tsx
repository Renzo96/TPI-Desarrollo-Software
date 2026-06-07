"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, ArrowRightLeft, Brain, BarChart3, Menu, X } from "lucide-react"
import { useState } from "react"

const links = [
  { href: "/", label: "Dashboard", icon: BarChart3 },
  { href: "/products", label: "Productos", icon: Package },
  { href: "/movements", label: "Movimientos", icon: ArrowRightLeft },
  { href: "/ai", label: "IA Insights", icon: Brain },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-200 dark:bg-zinc-900/80 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-zinc-900 dark:text-white">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>StockWise</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 px-4 py-3 space-y-1">
          {links.map((link) => {
            const active = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </nav>
  )
}
