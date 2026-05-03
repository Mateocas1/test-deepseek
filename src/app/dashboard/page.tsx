"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatARS } from "@/lib/utils";
import { CalendarDays, CreditCard, Clock, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const allAppointments = useQuery(api.appointments.getAll);

  if (!allAppointments) {
    return <p className="text-muted-foreground">Cargando...</p>;
  }

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = allAppointments.filter((a: any) => a.date === today);
  const pendingPayments = allAppointments.filter(
    (a: any) => a.status === "pending"
  );
  const confirmed = allAppointments.filter(
    (a: any) => a.status === "confirmed" || a.status === "deposit_paid"
  );

  const totalRevenue = allAppointments
    .filter((a: any) => a.depositPaid)
    .reduce((sum: number, a: any) => sum + a.depositAmount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Resumen</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Turnos hoy
            </CardTitle>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{todayAppointments.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes de pago
            </CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              {pendingPayments.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmados
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{confirmed.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos (depósitos)
            </CardTitle>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatARS(totalRevenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Turnos de hoy</CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay turnos para hoy.
            </p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt: any) => (
                <div
                  key={apt._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {apt.time} hs —{" "}
                      <span className="capitalize">
                        {apt.type.replace("-", " ")}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatARS(apt.totalAmount)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      apt.status === "deposit_paid" || apt.status === "confirmed"
                        ? "bg-primary/10 text-primary"
                        : apt.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : apt.status === "cancelled"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {apt.status === "deposit_paid"
                      ? "Depósito pagado"
                      : apt.status === "confirmed"
                      ? "Confirmado"
                      : apt.status === "pending"
                      ? "Pendiente"
                      : apt.status === "cancelled"
                      ? "Cancelado"
                      : apt.status === "completed"
                      ? "Completado"
                      : apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
