"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatARS } from "@/lib/utils";

export default function AppointmentsPage() {
  const allAppointments = useQuery(api.appointments.getAll);
  const updateStatus = useMutation(api.appointments.updateStatus);

  if (!allAppointments) {
    return <p className="text-muted-foreground">Cargando...</p>;
  }

  const sorted = [...allAppointments].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Turnos</h1>
        <div className="flex gap-2">
          <Badge variant="secondary">
            {allAppointments.length} total
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los turnos</CardTitle>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay turnos registrados.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Fecha
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Hora
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Estado
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((apt: any) => (
                    <tr key={apt._id} className="border-b border-border/50">
                      <td className="py-3 px-2">{apt.date}</td>
                      <td className="py-3 px-2">{apt.time} hs</td>
                      <td className="py-3 px-2 capitalize">
                        {apt.type.replace("-", " ")}
                        {apt.origin === "colega" && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Colega
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        {formatARS(apt.totalAmount)}
                      </td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={
                            apt.status === "confirmed" || apt.status === "deposit_paid"
                              ? "default"
                              : apt.status === "pending"
                              ? "secondary"
                              : apt.status === "cancelled"
                              ? "destructive"
                              : "outline"
                          }
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
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          {apt.status === "deposit_paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateStatus({ id: apt._id, status: "confirmed" })
                              }
                            >
                              Confirmar
                            </Button>
                          )}
                          {(apt.status === "pending" || apt.status === "confirmed") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() =>
                                updateStatus({ id: apt._id, status: "cancelled" })
                              }
                            >
                              Cancelar
                            </Button>
                          )}
                          {apt.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateStatus({ id: apt._id, status: "completed" })
                              }
                            >
                              Completar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
