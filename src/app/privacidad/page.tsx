export default function PrivacyPage() {
  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto prose prose-sm">
        <h1>Términos de Privacidad</h1>
        <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString("es-AR")}</p>

        <h2>Recopilación de datos</h2>
        <p>
          En Mena Nails, recopilamos únicamente los datos necesarios para gestionar
          las reservas de turnos: nombre, correo electrónico (a través de Google
          al iniciar sesión) y número de teléfono opcional.
        </p>

        <h2>Uso de datos</h2>
        <p>
          Los datos recopilados se utilizan exclusivamente para:
        </p>
        <ul>
          <li>Gestionar reservas de turnos</li>
          <li>Comunicarnos con vos sobre tu turno</li>
          <li>Procesar pagos a través de Mercado Pago</li>
          <li>Mejorar nuestros servicios</li>
        </ul>

        <h2>Procesamiento de pagos</h2>
        <p>
          Los pagos se procesan a través de Mercado Pago S.A. No almacenamos
          información de tarjetas de crédito/débito ni datos bancarios
          sensibles en nuestros servidores.
        </p>

        <h2>Autenticación</h2>
        <p>
          Utilizamos Clerk para la autenticación con Google. Clerk maneja los
          datos de autenticación de forma segura y cumple con las regulaciones
          de privacidad aplicables.
        </p>

        <h2>Almacenamiento de datos</h2>
        <p>
          Tus datos se almacenan en Convex (base de datos serverless) y en
          Vercel (hosting). Ambos proveedores cumplen con estándares de
          seguridad industriales.
        </p>

        <h2>Derechos</h2>
        <p>
          Tenés derecho a solicitar la eliminación de tus datos en cualquier
          momento. Para hacerlo, contactanos a través de Instagram o
          escribinos desde el correo asociado a tu cuenta.
        </p>

        <h2>Cookies</h2>
        <p>
          Este sitio utiliza cookies esenciales para el funcionamiento de la
          autenticación. No utilizamos cookies de rastreo ni publicitarias.
        </p>

        <h2>Contacto</h2>
        <p>
          Si tenés preguntas sobre estos términos, contactanos a través de
          nuestro Instagram: @menanails.
        </p>
      </div>
    </section>
  );
}
