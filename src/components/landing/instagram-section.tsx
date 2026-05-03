import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstagramSection() {
  return (
    <section id="instagram" className="py-24 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto text-center">
        <Image className="w-12 h-12 mx-auto mb-6 text-accent" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Seguinos en Instagram
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Seguí nuestro día a día, mirá los últimos trabajos y enterate de
          promociones exclusivas.
        </p>
        <a
          href="https://instagram.com/menanails"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" size="lg" className="gap-2">
            <Image className="w-5 h-5" />
            @menanails
          </Button>
        </a>
      </div>
    </section>
  );
}
