"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function GallerySection() {
  const images = useQuery(api.gallery.list);

  if (!images || images.length === 0) {
    return (
      <section id="galeria" className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Galería</h2>
          <p className="text-muted-foreground">
            Próximamente — trabajos realizados por Mena Nails.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="galeria" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Galería</h2>
          <p className="text-muted-foreground">Algunos de nuestros trabajos</p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img: any) => (
            <div key={img._id} className="break-inside-avoid">
              <img
                src={`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${img.storageId}`}
                alt={img.caption ?? "Trabajo de uñas"}
                className="w-full rounded-xl object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
