import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3">Mena Nails</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Soft gel, capping y semipermanente. Turno online.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Navegación</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <Link href="/#galeria" className="hover:text-foreground transition-colors">Galería</Link>
            <Link href="/#sobre-mi" className="hover:text-foreground transition-colors">Sobre mí</Link>
            <Link href="/booking" className="hover:text-foreground transition-colors">Reservar turno</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Ubicación</h4>
          <div className="rounded-xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3288.18893815162!2d-58.580945824299235!3d-34.49809405192753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbb0183179f97%3A0x84f372fb8f486c57!2sMena%20Nails!5e0!3m2!1ses!2sar!4v1777682625979!5m2!1ses!2sar"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación Mena Nails"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Mena Nails. Todos los derechos reservados.</p>
        <Link href="/privacidad" className="hover:text-foreground transition-colors underline underline-offset-2">
          Términos de privacidad
        </Link>
      </div>
    </footer>
  );
}
