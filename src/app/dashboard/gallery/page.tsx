"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GalleryManagement() {
  const images = useQuery(api.gallery.listAll);
  const addImage = useMutation(api.gallery.add);
  const removeImage = useMutation(api.gallery.remove);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/upload`;
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { storageId } = await response.json();
      const order = (images?.length ?? 0) + 1;
      await addImage({ storageId, order });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Galería</h1>
        <label className="cursor-pointer">
          <Button disabled={uploading} asChild>
            <span>{uploading ? "Subiendo..." : "Subir imagen"}</span>
          </Button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      {(!images || images.length === 0) ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No hay imágenes en la galería. Subí la primera.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img: any) => (
            <Card key={img._id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${img.storageId}`}
                  alt={img.caption ?? ""}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  #{img.order}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive h-8"
                  onClick={() => removeImage({ id: img._id })}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
