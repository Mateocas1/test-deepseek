"use client";

import Link from "next/link";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isSignedIn, userId } = useAuth();
  const user = useQuery(api.users.getByClerkId, userId ? { clerkId: userId } : "skip");
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          Mena Nails
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Inicio
          </Link>
          <Link href="/#galeria" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Galería
          </Link>
          <Link href="/#sobre-mi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sobre mí
          </Link>
          <Link href="/#resenas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Reseñas
          </Link>
          <Link
            href="/booking"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Reservar turno
          </Link>
          {isAdmin && (
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
          )}
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <Button size="sm">Ingresar</Button>
              </SignInButton>
            )}
          </div>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-sm">Inicio</Link>
          <Link href="/#galeria" onClick={() => setMobileOpen(false)} className="text-sm">Galería</Link>
          <Link href="/#sobre-mi" onClick={() => setMobileOpen(false)} className="text-sm">Sobre mí</Link>
          <Link href="/#resenas" onClick={() => setMobileOpen(false)} className="text-sm">Reseñas</Link>
          <Link href="/booking" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-primary">Reservar turno</Link>
          {isAdmin && (
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
            </Link>
          )}
          <div className="pt-2">
            {isSignedIn ? <UserButton /> : (
              <SignInButton mode="modal">
                <Button size="sm" className="w-full">Ingresar</Button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
