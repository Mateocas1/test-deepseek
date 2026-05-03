export default function AboutSection() {
  return (
    <section id="sobre-mi" className="py-24 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
          <div className="text-center p-8">
            <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl">💅</span>
            </div>
            <p className="text-sm text-muted-foreground">Foto de Mena</p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sobre Mí</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Soy Mena, nail artist apasionada por el cuidado y la estética de
              las uñas. Con años de experiencia en soft gel, capping y
              semipermanente, mi objetivo es que cada cliente se vaya con las
              uñas perfectas y una sonrisa.
            </p>
            <p>
              En Mena Nails, cada servicio es personalizado. Escucho lo que
              necesitás y te asesoro para que elijas el estilo que más te
              favorezca. Usamos productos de primera calidad para garantizar
              resultados duraderos y saludables.
            </p>
            <p>
              Turno a turno, construimos una relación de confianza. Porque tus
              uñas merecen lo mejor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
