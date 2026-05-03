"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        textRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      )
        .fromTo(
          subtitleRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          ctaRef.current?.children ? Array.from(ctaRef.current.children) : [],
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
          "-=0.3"
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <p className="text-sm font-medium text-primary mb-4 tracking-widest uppercase">
          Salón de uñas profesional
        </p>
        <h1
          ref={textRef}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
            Tus uñas{" "}
          <span className="text-primary">perfectas</span>
          , <br />
            hecho por{" "}
          <span className="text-accent">Mena</span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg text-muted-foreground max-w-xl mx-auto mb-10"
        >
            Soft gel, capping y semipermanente. Reservá tu turno online y
            dejate mimar por profesionales.
        </p>
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/booking">
            <Button size="lg" className="text-base px-8">
              Reservá tu turno
            </Button>
          </Link>
          <Link href="#galeria">
            <Button variant="outline" size="lg" className="text-base px-8">
              Ver trabajos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
