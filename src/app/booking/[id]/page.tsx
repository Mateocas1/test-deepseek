"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatARS } from "@/lib/utils";
import Link from "next/link";

export default function BookingConfirmation() {
  const params = useParams();
  const appointment = useQuery(api.appointments.getById, {
    id: params.id as any,
  });
  const settings = useQuery(api.settings.get, { key: "mp_account" });

  if (!appointment) {
    return (
      <section className="min-h-screen pt-24 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <p className="text-muted-foreground">Cargando...</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">{appointment.status === "pending" ? "⏳" : "✅"}</span>
            </div>
            <CardTitle>
              {appointment.status === "pending"
                ? "Turno pendiente de pago"
                : "Turno confirmado"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <span className="text-muted-foreground">Tipo</span>
              <span className="font-medium capitalize">
                {appointment.type.replace("-", " ")}
              </span>
              {appointment.retiroSubcategory && (
                <>
                  <span className="text-muted-foreground">Retiro</span>
                  <span className="font-medium capitalize">
                    {appointment.retiroSubcategory.replace("-", " ")}
                  </span>
                </>
              )}
              {appointment.servicioSubcategory && (
                <>
                  <span className="text-muted-foreground">Servicio</span>
                  <span className="font-medium capitalize">
                    {appointment.servicioSubcategory.replace("-", " ")}
                  </span>
                </>
              )}
              <span className="text-muted-foreground">Fecha</span>
              <span className="font-medium">{appointment.date}</span>
              <span className="text-muted-foreground">Horario</span>
              <span className="font-medium">{appointment.time} hs</span>
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">{formatARS(appointment.totalAmount)}</span>
              <span className="text-muted-foreground">Depósito</span>
              <span className="font-bold text-primary">
                {formatARS(appointment.depositAmount)}
              </span>
            </div>

            <Separator />

            {appointment.paymentMethod === "transfer" && !appointment.depositPaid && (
              <div className="bg-muted rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold">Datos para transferencia:</p>
                <p className="text-sm text-muted-foreground">
                  Alias: <span className="font-mono text-foreground">{settings?.value?.alias ?? "—"}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  CVU: <span className="font-mono text-foreground">{settings?.value?.cvu ?? "—"}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Transferí exactamente <strong>{formatARS(appointment.depositAmount)}</strong>.
                  Tenés 2 horas para enviar el comprobante.
                </p>
              </div>
            )}

            {appointment.paymentMethod === "platform" && !appointment.depositPaid && (
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Vas a ser redirigido a Mercado Pago para pagar el depósito de{" "}
                  <strong>{formatARS(appointment.depositAmount)}</strong>.
                </p>
                <Button className="w-full">Pagar con Mercado Pago</Button>
              </div>
            )}

            {appointment.depositPaid && (
              <div className="bg-primary/10 rounded-xl p-4 text-center">
                <p className="text-sm font-medium text-primary">
                  Depósito confirmado. Te esperamos el {appointment.date} a las{" "}
                  {appointment.time} hs.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Volver al inicio
                </Button>
              </Link>
              <Link href="/booking" className="flex-1">
                <Button variant="ghost" className="w-full">
                  Nuevo turno
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
